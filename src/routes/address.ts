import { Router } from "express";
import { body } from "express-validator/check";
import AddressCtrl from "../controllers/address";
import authorize from "../middleware/authorize";

const addressCtrl = new AddressCtrl();
const router = Router();


router.get('/list',authorize(),addressCtrl.getAllAddress);

router.post('/add',[
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
        .not()
        .isEmpty(),
    body('coord')
        .isArray()
  ],authorize(),addressCtrl.createAddress);

router.put('/edit/:adrId',[
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
        .not()
        .isEmpty(),
    body('coord')
        .isArray()
  ],authorize(),addressCtrl.updateAddress);

router.delete('/delete/:adrId',authorize(),addressCtrl.deleteAddress);

export default router;