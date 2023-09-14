import express from "express";
const router = express.Router();
import WorkloadController from "../controllers/workloadcontroller";
import AuthGuard from "../middleware/authguard";
// import { createUserSchema } from "./schema/user.schema";

const Workload = new WorkloadController();
const authGuard = new AuthGuard();

/**
 * Workloads routes
 */
router.post('/workload/resource_mapping/create', authGuard.validateToken, Workload.workloadCreateAndUpdate);
router.put('/workload/resource_mapping/edit', authGuard.validateToken, Workload.workloadCreateAndUpdate);
router.delete('/workload/resource_mapping/delete/:workload_id', authGuard.validateToken, Workload.workloadDelete);
router.put('/workload/rename', authGuard.validateToken, Workload.workloadRename);
router.put('/workload/name/check', authGuard.validateToken, Workload.workloadNameExist);
router.put('/workload/discovery/sync/update', authGuard.validateToken, Workload.discoverSyncUpdate);
router.get('/project/workload/list/:_id', authGuard.validateToken, Workload.getAllWorkload);
router.get('/workload/list', authGuard.validateToken, Workload.getAllWorkloadInfinityScroll);
router.get('/workload/cloud_platform/list', authGuard.validateToken, Workload.getAllCloudPlatform);
router.post('/workload/resource_grouping/create', authGuard.validateToken, Workload.workloadResourceGrpMaster);
router.get('/workload/cloud_category/list', authGuard.validateToken, Workload.getCloudCategory);
router.post('/workload/map', authGuard.validateToken, Workload.projectUserMapCreate);
router.get('/workload/resource_mapping/view/:_id', authGuard.validateToken, Workload.getWorkload);
router.get('/workload/resource_grouping/list', authGuard.validateToken, Workload.getAllCloudResourceGrp);
router.get('/workload/resources/list', authGuard.validateToken, Workload.getAllResources);

router.post('/Azure/image/upload', authGuard.validateToken, Workload.uploadImageToAzure);

router.get('/workload/resource/info', authGuard.validateToken, Workload.getResourceInfo);
router.get('/workload/cloud/accountname', authGuard.validateToken, Workload.getAllCloudAccountName);
router.get('/workload/list/:_id', authGuard.validateToken, Workload.getWorkloads);
router.get('/workloadmap/list/:_id', authGuard.validateToken,Workload.getWorkloadMapList);

module.exports.route = router;
