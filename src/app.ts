import * as dotenv from 'dotenv';

dotenv.config();

import path from 'path';
import express,{ NextFunction, Request, Response } from 'express';
import bodyParser from'body-parser';
import cookieParser from'cookie-parser';

import multer from 'multer';
import setMongo from './mongo';
import setRoutes from './routes';
import errorMiddleware from './middleware/error. middleware';
import uuid from 'uuid-random';

const app = express();

app.set('port', (process.env.PORT || 4200));
app.use(bodyParser.json()); // application/json
app.use(cookieParser());



const fileStorage = multer.diskStorage({
  destination: (req:Request, file:any, cb:any) => {
    cb(null, path.resolve(__dirname, 'images'));
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + '-' + file.originalname);
  }
});

const fileFilter = (req:Request, file:any, cb:any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.resolve(__dirname, 'images')));


app.use((req:Request, res:Response, next:NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(errorMiddleware);

async function main(): Promise<any> {
    try {
      await setMongo();
    
      setRoutes(app);
      
      app.listen(app.get('port'), () => console.log(`listening on port ${app.get('port')}`));
    } catch (err) {
      //console.error(err);
    }
  }


main();

export { app };




