import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';
import AppConstants from './utils/constant';
import { SamlConfig } from 'passport-saml/lib/passport-saml/types';
import { findByUserFields, generateAuthToken, updateUserByid, userCreate } from './models/usermodel';
import { findByField } from './models/tenantmodel';
import _ from 'lodash';
import { tenantGrpMatch } from './models/tenantgroupmodel';
import { findAndUpdateAuthToken } from "./models/authtokenmodel";
const routes = require('./routes/routes');
const connections = require('./database/db');
const session = require('express-session');
import axios from 'axios';
import connectToDB from './database/db';
const logger = require('./helpers/logger');


require('dotenv').config();


const app = express();
const appConstant = new AppConstants();
const port = process.env.PORT ?? 5001;

// To configure Application json
// Built-in middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(helmet());
app.use(cors());

connectToDB()
  .then((db:any) => {
    logger.info(appConstant.DBCONNECTION.SUCCESSFUL);
  })
  .catch((error:any) => {
    logger.error(appConstant.DBCONNECTION.UNSUCCESSFUL, error);
  });

// Passport.js Configuration
const x509Certificate = `${process.env.CERT}`
let samlConfig: SamlConfig = {
    entryPoint: `${process.env.ENTRY_POINT}`,
    issuer: `${process.env.ISSUER}`,
    callbackUrl: `${process.env.CALLBACK_URL}`,
    cert: `-----BEGIN CERTIFICATE-----\n${x509Certificate}\n-----END CERTIFICATE-----`,
    disableRequestedAuthnContext: true
    // Add any additional configuration options as needed
};

passport.use(
    new SamlStrategy(
        {
            ...samlConfig,
            passReqToCallback: true,
        },
        (req, profile: any, done: any) => {
            const email = profile[`${process.env.SSO_EMAIL}`];
            const user_Entered_domain = email.split('@')[1];
            const domain_name = samlConfig.additionalParams;
            const azure_Domain = domain_name?.domain_name;
            if (user_Entered_domain === azure_Domain) {
                return done(null, profile);
            } else {
                if (req.res) {
                    return req.res.redirect(`${process.env.SERVER_IP_ADDRESS}/login-sso?message=${encodeURIComponent(appConstant.ERROR_MESSAGES.SSO_DOMAIN_MISMATCH)}`);
                } else {
                    return done(new Error(appConstant.LOGGER_MESSAGE.UNABLE_TO_REDIRECT));
                }
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    // Extract the necessary information from the profile object
    const email_address = user[`${process.env.SERIALIZE_USER_EMAIL}`];
    const id = user[`${process.env.SERIALIZE_USER_ID}`];
    const displayName = user[`${process.env.SERIALIZE_USER_DISPLAYNAME}`];
    const serializedUser = {
        id: id, //Object ID
        displayName: displayName,// User name
        email: email_address// email
        // Add any other required user properties
    };
    done(null, serializedUser);
});

passport.deserializeUser(async (serializedUser: any, done) => {
    // Reconstruct the user object from the serialized user information
    const user = {
        id: serializedUser.id,
        displayName: serializedUser.displayName,
        email: serializedUser.email
        // Add any other required user properties
    };
    done(null, user);
});

app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(`${process.env.BASE_URL}`, routes.route);

app.get('/saml/login', passport.authenticate('saml'));
app.post('/usersvc/api/overview',
    passport.authenticate('saml', { failureRedirect: '/forgetpassword' }),
    async (req: any, res: any) => {
        let generateAuth;
        let responseObj: any;
        let userDetails: any;
        const domain_name = req.session.passport.user.email.split('@')[1];
        const isDomainExist = await findByField({ domain_name: domain_name });
        const isActiveUser: any = await findByField({ status: appConstant.USER_STATUS.STATUS_CONFIRMED });
        if(isActiveUser == null || isActiveUser == "") {
            res.redirect(`${process.env.SERVER_IP_ADDRESS}/login-sso?message=${encodeURIComponent(appConstant.LOGGER_MESSAGE.USER_NOT_FOUND)}`);
            return;
        }
        if (isDomainExist == null) {
            res.status(400).send(appConstant.ERROR_MESSAGES.DOMAIN_NOT_REGISTER);// need to change the msg 
        }
        else if (isDomainExist.sso_enabled == appConstant.SCHEMA.ISINACTIVE) {
            res.redirect(`${process.env.SERVER_IP_ADDRESS}/login-sso?message=${encodeURIComponent(appConstant.ERROR_MESSAGES.SSO_NOT_ENABLED)}`);
            return;
        }
        else {
            const dynamicFields = { email: req.session.passport.user.email, status: appConstant.USER_STATUS.STATUS_CONFIRMED }
            const checkUser = await findByUserFields(dynamicFields);
            userDetails = checkUser != null ? checkUser : {};
            if (checkUser != null) {
                const userData = {
                    _cls: appConstant.SCHEMA._CLS_USER,
                    _id: checkUser._id,
                    first_name: checkUser.first_name,
                    email: checkUser.email,
                    isAdmin: checkUser.user_type == appConstant.SCHEMA.NORMAL_USER ? false : true,
                    tenant_id: checkUser.tenant_id,
                    tenant_group_id: checkUser.tenant_group_id,
                    user_type: checkUser.user_type
                }
                generateAuth = await generateAuthToken(userData, isDomainExist)
                const dynamicFields = {
                    last_login_at: new Date()
                };
                await updateUserByid(appConstant.SCHEMA._CLS_USER, checkUser._id, dynamicFields);
                responseObj = {
                    _id: checkUser._id,
                    tenant_id: checkUser.tenant_id,
                    token: generateAuth,
                    user_name: checkUser.first_name + checkUser.last_name
                }
                const values = {
                    user_id: checkUser._id,
                    email: checkUser.email,
                    token: generateAuth,
                    tenant_id: checkUser.tenant_id,
                    tenant_group_id: checkUser.tenant_group_id,
                    created_at: new Date()
                }
                await findAndUpdateAuthToken({ email: checkUser.email }, values);
            } else {
                userDetails = {
                    user_type  : appConstant.SCHEMA.NORMAL_USER
                }
                const tenant_group: any = await tenantGrpMatch(isDomainExist._id);
                const user = await userCreate({
                    _cls: appConstant.SCHEMA._CLS_USER,
                    tenant_id: isDomainExist._id,
                    tenant_group_id: tenant_group ? tenant_group[0]._id : '',
                    first_name: req.session.passport.user.displayName,
                    last_name: "",
                    email: (req.session.passport.user.email as string).toLowerCase(),
                    user_type: appConstant.SCHEMA.NORMAL_USER,
                    login_type: appConstant.SCHEMA.SSO_USER,
                    last_login_at: new Date()
                });
                const userData = {
                    _cls: user._cls,
                    _id: user._id,
                    first_name: user.first_name,
                    email: user.email,
                    user_type: appConstant.SCHEMA.NORMAL_USER,
                    isAdmin: user.user_type == appConstant.SCHEMA.NORMAL_USER ? false : true,
                    tenant_id: user.tenant_id,
                    tenant_group_id: user.tenant_group_id,
                }
                generateAuth = await generateAuthToken(userData, isDomainExist);
                responseObj = {
                    _id: user._id,
                    tenant_id: user.tenant_id,
                    token: generateAuth,
                    user_name: user.first_name + user.last_name
                }
                const values = {
                    user_id: user._id,
                    email: user.email,
                    token: generateAuth,
                    tenant_id: user.tenant_id,
                    tenant_group_id: user.tenant_group_id,
                    created_at: new Date()
                }
                await findAndUpdateAuthToken({ email: user.email }, values);
            }
        }
        // SAML authentication successful, handle the authenticated user
        res.redirect(`${process.env.SERVER_IP_ADDRESS}/overview?sso=true&id=${encodeURIComponent(responseObj._id)}&tenant_id=${encodeURIComponent(responseObj.tenant_id)}&user_type=${encodeURIComponent(userDetails.user_type)}&token=${encodeURIComponent(responseObj.token)}&user_name=${encodeURIComponent(responseObj.user_name)}`);
    }
);

app.get('/usersvc/api/sso-proxy', async (req, res) => {
    samlConfig.additionalParams = { domain_name: `${req.query.domain_name}` }
    const isDomainExist = await findByField({ domain_name: req.query.domain_name, sso_enabled: appConstant.SCHEMA.ISACTIVE });
    if (isDomainExist == null) {
        res.status(400).send(appConstant.ERROR_MESSAGES.DOMAIN_NOT_REGISTER);// need to change the msg 
    } else {
        // Forward the request to the backend server
        const backendUrl = `${process.env.SSO_PROXY_BACKEND_URL}`;
        axios.get(backendUrl)
            .then(response => {
                const responseUrl = response.request.res.responseUrl;
                // Return the response from the backend to the frontend
                res.send(responseUrl);
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error(error);
                res.status(500).send(appConstant.LOGGER_MESSAGE.INTERNAL_SERVER_ERROR);
            });
    }
});

app.listen(port, () => {
    logger.info(appConstant.MESSAGES.PORT_LISTEN + `${port}`);
});