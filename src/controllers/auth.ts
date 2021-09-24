import bcrypt from 'bcryptjs';
import User from "../models/user";
import { validationResult } from 'express-validator/check';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import userService from '../services/auth';

class UserCtrl  {
   
  
    setTokenCookie=(res, token)=>
    {
        // create http only cookie with refresh token that expires in 7 days
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 7*24*60*60*1000)
        };

        res.cookie('refreshToken', token, cookieOptions);
    }

    login = async (req:Request, res:Response, next:NextFunction) => {
        const email = req.body.email;
        const password = req.body.password;
        const ipAddress=req.ip;

        userService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            this.setTokenCookie(res, refreshToken);
            res.status(200).json(user);
        })
        .catch(next);
    };


    refreshToken=(req, res, next)=> {
      const token = req.cookies.refreshToken;
      const ipAddress = req.ip;

      console.log(token);
      userService.refreshToken({ token, ipAddress })
          .then(({ refreshToken, ...user }) => {
              this.setTokenCookie(res, refreshToken);
              res.status(200).json(user);
          })
          .catch(next);
    }


    revokeToken=(req, res, next) =>{

      // accept token from request body or cookie
      const token = req.body.token || req.cookies.refreshToken;
      const ipAddress = req.ip;
  
      if (!token) return res.status(400).json({ message: 'Token is required' });
  
      // users can revoke their own tokens and admins can revoke any tokens
      if (!req.user.ownsToken(token) && req.user.role !== 'Admin') {
          return res.status(401).json({ message: 'Unauthorized' });
      }
      
     
      userService.revokeToken({ token, ipAddress })
          .then(() => res.status(200).json({ message: 'Token revoked' }))
          .catch(next);
  }
  

    signup = async (req:Request, res:Response, next:NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const role=req.body.role || 'User';

        try {
          const hashedPw = await bcrypt.hash(password, 12);
      
          const user = new User({
            email: email,
            password: hashedPw,
            name: name,
            role:role,
            cart: { items: [] }
          });

          const result = await user.save();
          res.status(201).json({ message: 'User created!', userId: result._id });
        } 
        catch (err:any) 
        {
           next(new HttpException(500,'Something went wrong'));
        }
      };

      getUserById=async (req:Request, res:Response, next:NextFunction) => {

      
        const userid=(req as any).user.userId;
  
        try {
          const user = await User.findById(userid);
      
          const result = ({
            email: user.email,
            name: user.name,
          });

          res.status(401).json(result);
        } 
        catch (err:any) 
        {
           next(new HttpException(500,'Something went wrong'));
        }
      };
      
      updateUserInfo=async (req:Request, res:Response, next:NextFunction) => {

      
        const userid=(req as any).user.userId;
        const name = req.body.name;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(new HttpException(422,'Validation failed.'));
        }

        try {
          const user = await User.findById(userid);
      
          if(!user)
          {
            return next(new HttpException(404,'Could not find user'));
          }

          if(user.status===0)
          {
            return next(new HttpException(401,'user is disabled'));
          }

          user.name=name;
          const result = await user.save();
          res.status(200).json({ message: 'User updated!', newname: result.name });
          
        } 
        catch (err:any) 
        {
           next(new HttpException(500,'Something went wrong'));
        }
      };


      getUserStatus = async (req:Request, res:Response, next:NextFunction) => {
        try {
          const userid=(req as any).params.userId;
          const user = await User.findById(userid);
          if (!user) {
            return next(new HttpException(404,'Could not find user'));
          }
          res.status(200).json({ name:user.name,status: user.status });
        } catch (err) {
          next(new HttpException(500,'Something went wrong'));
        }
      };

      updateUserStatus=async (req:Request, res:Response, next:NextFunction) => {

      
        const userid=(req as any).params.userId;
        const status = req.body.status;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return next(new HttpException(422,'Validation failed.'));
        }

        try {
          const user = await User.findById(userid);
      
          if(!user)
          {
            return next(new HttpException(404,'Could not find user'));
          }

        
          user.status=status;
          const result = await user.save();
          res.status(200).json({ message: 'User Status changed!' });
          
        } 
        catch (err:any) 
        {
           next(new HttpException(500,'Something went wrong'));
        }
      };



  }
  
  export default UserCtrl;