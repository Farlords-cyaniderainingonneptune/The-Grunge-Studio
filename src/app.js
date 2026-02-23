import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import{json, urlencoded} from 'express';
// import pgp from 'pg-promise';
// import bcrypt from 'bcryptjs';
// import Crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import { v4 as uuidv4 } from 'uuid';
// import fileUpload from 'express-fileupload';
// import {v2 as cloudinary} from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
// import multer from 'multer';
import fs from 'fs';
import routes from './routes/index.js'
// import {upload} from './multer.js';
// import routes from "./routes/index.js"

const app = express();

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors()); 


app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to The Grunge Studio' });
})
routes(app);

// 404 Error Handling
app.use((_req,res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  })
});

// internal server error, Error Handling
app.use((_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Ooooops! Something broke somewhere, we will look into it, contact us'
  })
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});
export default app;
