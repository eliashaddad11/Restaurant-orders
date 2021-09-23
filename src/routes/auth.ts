import { body } from "express-validator/check";
import UserCtrl from "../controllers/auth";
import User from "../models/user";
import { Router } from 'express';
import authorize from '../middleware/authorize'

const userCtrl = new UserCtrl();
const router = Router();

router.post('/login',userCtrl.login);

router.post('/refresh-token',userCtrl.refreshToken);

router.post('/revoke-token',authorize(),userCtrl.revokeToken);

router.post('/signup',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc:any)=> {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],userCtrl.signup);

  router.get('/user',authorize(),userCtrl.getUserById);

  router.put('/user',[
    body('name')
    .not()
    .isEmpty(),
  ],authorize(),userCtrl.updateUserInfo);


  router.get('/user/status/:userId',authorize(['Admin']),userCtrl.getUserStatus);

  router.patch('/user/status/:userId',authorize(['Admin']),userCtrl.updateUserStatus);


export default router;

