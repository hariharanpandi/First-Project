import express from "express";
const router = express.Router();
import ProjectController from "../controllers/projectcontroller";
import AuthGuard from "../middleware/authguard";
// import { createUserSchema } from "./schema/user.schema";

const projects = new ProjectController();
const authGuard = new AuthGuard();

/**
 * CRUD operations for project
 */
router.post('/project/create', authGuard.validateToken, projects.projectCreate);
router.get('/projects/list', authGuard.validateToken, projects.getAllProject);
router.put('/project/update/:_id', authGuard.validateToken, projects.projectUpdate);
router.get('/project/getInfo', authGuard.validateToken, projects.getProjectInfo)
router.delete('/project/delete/:_id', authGuard.validateToken, projects.projectDelete);

/**
 * CRUD operations for application
 */
router.post('/app/create', authGuard.validateToken, projects.applicationCreate);
router.put('/app/update/:_id', authGuard.validateToken, projects.applicationUpdate);
router.delete('/app/delete/:_id', authGuard.validateToken, projects.applicationDelete);
router.get('/project/application/list/:_id', authGuard.validateToken, projects.getAllApplication);
router.get('/app/getInfo/:_id', authGuard.validateToken, projects.getApplicationInfo);
router.post('/app/getall/list', authGuard.validateToken, projects.getApplication);

/**
 * Mapping project and application with user
 */
router.post('/project/map', authGuard.validateToken, projects.projectUserRoleMapUpdate);
router.put('/projects/rolemapping/update', authGuard.validateToken, projects.projectUserRoleMapUpdate);
router.get('/users/list/:project_id', authGuard.validateToken, projects.getProjectUser);
router.get('/user/rolemapped', authGuard.validateToken, projects.checkUserRoleMap);

/**
 * Cloud management routes
 */
router.post('/cloud_token/create', authGuard.validateToken, projects.generateAuthTokenMist);
router.post('/cloud_account/create', authGuard.validateToken, projects.createCloudAccount);
router.put('/cloud_account/edit', authGuard.validateToken, projects.editCloudAccount);
router.post('/verifyconnection', authGuard.validateToken, projects.verifyCloudCredntial);
router.get('/get_cloud_details/:_id', authGuard.validateToken, projects.getCloudDetails);
router.post('/get_subscriptions', authGuard.validateToken, projects.getCloudSubscritions);
router.post('/getregions', authGuard.validateToken, projects.getRegions);
router.get('/clouds/count/list/:project_id', authGuard.validateToken, projects.cloudUsersCount);
router.get('/users/cloud/list', authGuard.validateToken, projects.cloudUserList);
router.put('/cloud/discovery', authGuard.validateToken, projects.getCloudDiscovery);
router.post('/cloud/get_progress', authGuard.validateToken, projects.getProgressCloud);

/**
 * Workload management - sidebar
 */
router.get('/getallcloudplatforms/:id', authGuard.validateToken, projects.getAllCloudplatforms);
router.post('/getall/cloudaccountname', authGuard.validateToken, projects.getAllCloudAccountnames);

router.get('/auto/rolemap', authGuard.validateToken, projects.autoRoleMap);

module.exports.route = router;