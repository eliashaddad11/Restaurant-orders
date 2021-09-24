import { Router } from "express";
import { body } from "express-validator/check";
import ProductCtrl from "../controllers/product";
import authorize from "../middleware/authorize";

const productCtrl = new ProductCtrl();
const router = Router();


router.get('/list',productCtrl.getProducts);

router.get('/list/:prodId',productCtrl.getProduct);

router.post('/add',[
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('price')
      .isNumeric()
      .not()
      .isEmpty(),
    body('description')
      .not()
      .isEmpty(),
    body('categoryId')
      .trim()
      .not()
      .isEmpty(),
  ],authorize(['Admin']),productCtrl.createProduct);

router.put('/edit/:prodId',[
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('price')
      .isNumeric()
      .not()
      .isEmpty(),
    body('description')
      .not()
      .isEmpty(),
    body('categoryId')
      .trim()
      .not()
      .isEmpty(),
  ],authorize(['Admin']),productCtrl.updateProduct);

router.delete('/delete/:prodId',authorize(['Admin']),productCtrl.deleteProduct);

export default router;