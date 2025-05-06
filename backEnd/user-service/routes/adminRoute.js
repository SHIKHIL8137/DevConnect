import express from 'express';
import { dashboardDetails ,getFreelancersData,getClientsData, updateBlockStatus} from '../controllers/adminServiceController.js';
const router = express.Router();


router.get('/adminDashDetails',dashboardDetails);
router.get('/freelancerDetails',getFreelancersData)
router.get('/clientDetails',getClientsData)
router.patch('/updataBlockStatus',updateBlockStatus);




export default router