import { Router } from "express";
import { body } from "express-validator/check";
import BranchCtrl from "../controllers/branch";
import authorize from "../middleware/authorize";

const branchCtrl = new BranchCtrl();
const router = Router();


router.get('/list',authorize(['Admin']),branchCtrl.getBranches);

router.get('/list-near/:addressId',authorize(),branchCtrl.getBranchesNear);

router.post('/add',[
    body('name')
      .trim()
      .not()
      .isEmpty(),
    body('coord')
        .isArray()
  ],authorize(['Admin']),branchCtrl.createBranch);

router.put('/edit/:brId',[
    body('name')
      .trim()
      .not()
      .isEmpty(),
    body('coord')
        .isArray()
  ],authorize(['Admin']),branchCtrl.updateBranch);

router.delete('/delete/:brId',authorize(['Admin']),branchCtrl.deleteBranch);

export default router;