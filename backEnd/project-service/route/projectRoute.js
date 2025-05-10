import express from 'express'
import { addProject } from '../controller/projectController.js';
import fileUpload from '../../shared/auth/config/fileUpload.js';
import { jwtAuthMiddleware } from '../../shared/auth/middleWares/jwtTokenVerify.js';
const route = express();

route.post('/addproject',jwtAuthMiddleware,fileUpload.array('attachments',5),addProject)

export default route