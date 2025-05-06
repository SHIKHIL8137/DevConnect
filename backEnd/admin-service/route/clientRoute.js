import express from 'express';
import { getClientsData } from '../controllers/clientController.js';
const route = express.Router();

route.get('/clientData',getClientsData);

export default route