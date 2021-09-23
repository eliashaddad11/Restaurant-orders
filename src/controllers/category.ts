import { validationResult } from "express-validator/check";
import path from "path";
import fs from 'fs';
import HttpException from "../exceptions/HttpException";
import Category from "../models/category";


class CategoryCtrl  {


    getCategories=async (req, res, next) => {
        const currentPage = req.query.page || 1;
        const perPage = 10;
        try {
          const totalItems = await Category.find({status:1}).countDocuments();
          const categories = await Category.find({status:1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
      
          res.status(200).json({
            message: 'Fetched categories successfully.',
            categories: categories,
            totalItems: totalItems
          });
        } 
        catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };


    createCategory = async (req, res, next) => {

       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

        if (!req.file) {
            return next(new HttpException(422,'No image provided.'));
        }

      
      try 
      {
          const imageUrl = req.file.filename;
          const title = req.body.title;

          const categ = new Category({
            title: title,
            imageUrl: imageUrl,
            products:[]
          });

          await categ.save();
          
          res.status(201).json({
            message: 'Category created successfully!',
            category: categ,
          });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      getCategory = async (req, res, next) => {
        const categId = req.params.categId;
        const categ = await Category.find({_id:categId});
        try {
          if (!categ) {
            return next(new HttpException(404,'Could not find category'));
          }
          res.status(200).json({ message: 'Category fetched.', category: categ });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      updateCategory = async (req, res, next) => {
        const categId = req.params.categId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }
        const title = req.body.title;
        let imageUrl = req.body.image;
        if (req.file) {
          imageUrl = req.file.filename;
        }
        if (!imageUrl) {
            return next(new HttpException(422,'No image provided.'));
        }
        try {
          const categ = await Category.findById(categId);
          if (!categ) {
            return next(new HttpException(404,'Could not find category'));
          }
          
          if (imageUrl !== categ.imageUrl) {
            this.clearImage(categ.imageUrl);
          }

          categ.title = title;
          categ.imageUrl = imageUrl;
          const result = await categ.save();
          res.status(200).json({ message: 'Category updated!', category: result });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      deleteCategory = async (req, res, next) => {
        const categId = req.params.categId;
        try {
          const categ = await Category.findOne({_id:categId,status:1});
      
          if (!categ) {
            return next(new HttpException(404,'Could not find category'));
          }

          categ.status = 0;
          await categ.save();
      
          res.status(200).json({ message: 'Deleted category.' });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      clearImage = filePath => {
        filePath = path.resolve(__dirname,'..','images', filePath);
        fs.unlink(filePath, err => console.log(err));
      };



}

export default CategoryCtrl;