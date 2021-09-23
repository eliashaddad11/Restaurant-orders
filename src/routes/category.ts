import { Router } from "express";
import { body } from "express-validator/check";
import CategoryCtrl from "../controllers/category";
import authorize from "../middleware/authorize";

const categoryCtrl = new CategoryCtrl();
const router = Router();


router.get('/list',categoryCtrl.getCategories);

router.get('/list/:categId',categoryCtrl.getCategory);

router.post('/add',[
    body('title')
      .trim()
      .not()
      .isEmpty()
  ],authorize(['Admin']),categoryCtrl.createCategory);

router.put('/edit/:categId',[
    body('title')
      .trim()
      .not()
      .isEmpty()
  ],authorize(['Admin']),categoryCtrl.updateCategory);

router.delete('/delete/:categId',authorize(['Admin']),categoryCtrl.deleteCategory);

export default router;