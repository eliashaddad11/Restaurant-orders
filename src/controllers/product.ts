import { validationResult } from "express-validator/check";
import path from "path";
import fs from 'fs';
import HttpException from "../exceptions/HttpException";
import Product from "../models/product";
import Category from "../models/category";


class ProductCtrl  {


    getProducts=async (req, res, next) => {
        const currentPage = req.query.page || 1;
        const searchitem=req.query.search;
        const categId=req.body.filter;
        const perPage = 10;

        var re = new RegExp(searchitem, 'i');
        try {
            
            if (categId)
            {
                const totalItems = await Product.find({$and:[{ $or: [{title: re },{description: re}] },{categoryId: categId}]}).countDocuments();
                const products = await Product.find({$and:[{ $or: [{title: re },{description: re}] },{categoryId: categId}]})
                  .skip((currentPage - 1) * perPage)
                  .limit(perPage);

                  res.status(200).json({
                    message: 'Fetched products successfully.',
                    products: products,
                    totalItems: totalItems
                  });
            }
            else
            {
                const totalItems = await Product.find({ $or: [{title: re },{description: re}]}).countDocuments();
                const products = await Product.find({ $or: [{title: re },{description: re}]})
                  .skip((currentPage - 1) * perPage)
                  .limit(perPage)
                 
                  res.status(200).json({
                    message: 'Fetched products successfully.',
                    products: products,
                    totalItems: totalItems
                  });
            }
         
      
          
        } 
        catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };


    createProduct = async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }

        if (!req.file) {
            return next(new HttpException(422,'No image provided.'));
        }

        const imageUrl = req.file.filename;
        const title = req.body.title;
        const price=+req.body.price;
        const description=req.body.description;
        const categoryId=req.body.categoryId;

        const prod = new Product({
          title: title,
          imageUrl: imageUrl,
          price:price,
          description:description,
          categoryId:categoryId
        });
        
        try {

          await prod.save();
          
          const categ = await Category.findById(categoryId);
          
          categ.products.push(prod._id);
          
          await categ.save();
          
          res.status(201).json({
            message: 'Product created successfully!',
            product: prod,
          });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      getProduct = async (req, res, next) => {
        const prodId = req.params.prodId;
        const prod = await Product.find({_id:prodId});
        try {
          if (!prod) {
            return next(new HttpException(404,'Could not find category'));
          }
          res.status(200).json({ message: 'Category fetched.', product: prod });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      updateProduct = async (req, res, next) => {
        const prodId = req.params.prodId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpException(422,'Validation failed.'));
        }
        const title = req.body.title;
        const price=req.body.price;
        const description=req.body.description;
        const categoryId=req.body.categoryId;
        let imageUrl = req.body.image;
        if (req.file) {
          imageUrl = req.file.filename;
        }
        if (!imageUrl) {
            return next(new HttpException(422,'No image provided.'));
        }
        try {
          const prod = await Product.findById(prodId);
          if (!prod) {
            return next(new HttpException(404,'Could not find category'));
          }
          
          if (imageUrl !== prod.imageUrl) {
            this.clearImage(prod.imageUrl);
          }

          prod.title = title;
          prod.price=price;
          prod.description=description;
          prod.categoryId=categoryId;
          prod.imageUrl = imageUrl;
          const result = await prod.save();
          res.status(200).json({ message: 'Product updated!', product: result });
        } catch (err) {
            next(new HttpException(500,'Something went wrong'));
        }
      };
      
      deleteProduct = async (req, res, next) => {

        const prodId = req.params.prodId;

        try {
          const prod = await Product.findOne({_id:prodId});
      
          if (!prod) {
            return next(new HttpException(404,'Could not find product'));
          }

           // Check logged in user
           this.clearImage(prod.imageUrl);

        
           const categId=prod.categoryId;
            await Product.findByIdAndRemove(prodId);
            
            const categ = await Category.findById(categId);
            
            categ.products.pull(prod._id);
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

export default ProductCtrl;