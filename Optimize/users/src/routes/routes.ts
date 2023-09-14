import express from "express";
const router = express.Router();
import { Request, Response } from 'express';
import AuthGuard from "../middleware/authguard";
import UserController from "../controllers/usercontroller";

const authGuard = new AuthGuard();
const userController = new UserController();

/**
 * Curd operations for tenant
 */
router.post('/tenant/create', userController.tenantRegister);
router.delete('/tenant/delete', authGuard.validateToken, userController.tenantDelete);

/**
 * Signin and Signout
 */
router.post('/signin', userController.loginUser);
router.delete('/signout', authGuard.validateToken, userController.logoutUser);
router.get('/logincms', userController.TermsofservicePrivacyPolicy);

/**
 * Password
 */
router.post('/forgetpassword', userController.forgetPassword);
router.post('/changepassword', userController.changePassword);
router.post('/password/edit/:_id', authGuard.validateToken, userController.userPasswordUpdate);
router.get('/users/pwdexpirationtime/:_id', userController.passwordExpirationCheck);

/**
 * Curd operations for users
 */
router.post('/user/create', authGuard.validateToken, userController.userRegister);
router.put('/user/update/:_id', authGuard.validateToken, userController.userUpdate);
router.delete('/user/delete/:_id', authGuard.validateToken, userController.userDelete);
router.get('/users/list', authGuard.validateToken, userController.getAllUsers);
router.get('/userinfo/:_id', authGuard.validateToken, userController.userInfoget);

/**
 * Project wise manage User
 */
router.get('/manage/user/list/:project_id', authGuard.validateToken, userController.manageUserList);
router.put('/manageuser/update/:_id', authGuard.validateToken, userController.UpdateUser);

/**
 * Other service call 
 */
router.get('/user/role',authGuard.validateToken, userController.getRoles);
router.get('/users/list/:project_id', authGuard.validateToken, userController.getAllProjectUsers);
router.post('/cloud/user/list',authGuard.validateToken, userController.getCloudUsers);


module.exports.route = router;