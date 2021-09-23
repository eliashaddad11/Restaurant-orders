import { validationResult } from "express-validator/check";
import HttpException from "../exceptions/HttpException";
import Address from "../models/address";
import Branch from "../models/branch";


class BranchCtrl  {


    getBranches=async (req, res, next) => {

        try {
            
           const result = await Branch.find();
                 
            res.status(200).json({
                message: 'Fetched branch successfully.',
                branch: result,
            });

        } 
        catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
    };

    getBranchesNear=async (req, res, next) => {

        const adrid=req.params.addressId;
        const address =Address.findOne({_id:adrid});
        let coord=[];
        if(address)
        {
          coord=address.coord;
        }
        
        try {
            
            const result = await Branch.aggregate(
            [
                { 
                    $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: coord
                    },
                    spherical: true,
                    distanceField: "dist.calculated",
                    maxDistance: 5000
                }},
                
            
            ]
            );
                    
            res.status(200).json({
                message: 'Fetched branch successfully.',
                branch: result,
            });

        } 
        catch (err) {
            next(new HttpException(500,''));
        }
    };

    createBranch = async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

    
        const name = req.body.name;
        const coord=req.body.coord;
        const loc = { type: 'Point', coordinates: coord };
        const br = new Branch({
          name: name,
          legacy:coord,
          location:loc
        });
        
        try {

          await br.save();
          
          res.status(201).json({
            message: 'Branch created successfully!',
            branch: br,
          });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
    
      updateBranch = async (req, res, next) => {
       
        const brId = req.params.brId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

        const name = req.body.name;
        const coord=req.body.coord;
        const loc = { type: 'Point', coordinates: coord };
        
        try {
          const br = await Branch.findById(brId);
          if (!br) {
            return next(new HttpException(404,'Could not find branch'));
          }
          
          br.name = name;
          br.legacy=coord;
          br.location=loc;
          const result = await br.save();
          res.status(200).json({ message: 'Branch updated!', branch: result });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      deleteBranch = async (req, res, next) => {

        const brId = req.params.brId;
        
        try {
          const br = await Branch.findOne({_id:brId});
      
          if (!br) {
            return next(new HttpException(404,'Could not find branch'));
          }

          
            await Branch.findByIdAndRemove(brId);
            
            res.status(200).json({ message: 'Deleted branch.' });

        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
}

export default BranchCtrl;