import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { adminProxy, userProxy } from './routes/proxyRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONDENDURL,
  credentials: true,
}));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use('/user',userProxy);
app.use('/admin',adminProxy);

app.listen(port, () => {
  console.log(`Gateway server running at port ${port}`);
});
