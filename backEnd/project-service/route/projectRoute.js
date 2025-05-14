import express from 'express'
import { addProject, applyToProject, freelancerHome, getProjectOfUser, projectDetails } from '../controller/projectController.js';
import fileUpload from '../../shared/auth/config/fileUpload.js';
import { jwtAuthMiddleware } from '../../shared/auth/middleWares/jwtTokenVerify.js';
const route = express();

route.post('/addProject',jwtAuthMiddleware,fileUpload.array('attachments',5),addProject)
route.get('/getProjectOfUser',jwtAuthMiddleware,getProjectOfUser);
route.get('/projectDetails',jwtAuthMiddleware,projectDetails);
route.get('/freelancerHome',freelancerHome);
route.post('/apply',jwtAuthMiddleware,applyToProject);

export default route