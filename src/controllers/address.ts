import { validationResult } from "express-validator/check";
import HttpException from "../exceptions/HttpException";
import Address from "../models/address";
import User from "../models/user";

class AddressCtrl  {


    getAllAddress=async (req, res, next) => {

        const userid=req.user.userId;

        try {
            
           const result = await Address.find({creator:userid});
                 
            res.status(200).json({
                message: 'Fetched address successfully.',
                address: result,
            });

        } 
        catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };


    createAddress = async (req, res, next) => {

        const userid=req.user.userId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

    
        const title = req.body.title;
        const description=req.body.description;
        const coord=req.body.coord;

        const adr = new Address({
          title: title,
          description:description,
          coord:coord,
          creator:userid
        });
        
        try {

          await adr.save();
          
          const user = await User.findById(userid);
          
          user.address.push(adr._id);
          
          await user.save();
          
          res.status(201).json({
            message: 'Address created successfully!',
            address: adr,
          });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
    
      updateAddress = async (req, res, next) => {
        const userid=req.user.userId;
        const adrId = req.params.adrId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

        const title = req.body.title;
        const description=req.body.description;
        const coord=req.body.coord;
        
        try {
          const adr = await Address.findById(adrId);
          if (!adr) {
            return next(new HttpException(404,'Could not find address'));
          }
          
          if(userid!=adr.creator)
          {
            return next(new HttpException(422,'UnAuthorized user'));
          }

          adr.title = title;
          adr.description = description;
          adr.coord=coord;
          const result = await adr.save();
          res.status(200).json({ message: 'Address updated!', address: result });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      deleteAddress = async (req, res, next) => {

        const adrId = req.params.adrId;
        const userid=req.user.userId;

        try {
          const adr = await Address.findOne({_id:adrId});
      
          if (!adr) {
            return next(new HttpException(404,'Could not find address'));
          }

          if(userid!=adr.creator)
          {
            return next(new HttpException(422,'UnAuthorized user'));
          }

            const userId=adr.creator;
            await Address.findByIdAndRemove(adrId);
            
            const user = await User.findById(userId);
            
            user.address.pull(adr._id);
            await user.save();
        
            res.status(200).json({ message: 'Deleted address.' });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
}

export default AddressCtrl;