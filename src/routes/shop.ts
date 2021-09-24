import { Router } from "express";
import { body } from "express-validator/check";
import OrderCtrl from "../controllers/shop";
import authorize from "../middleware/authorize";

const orderCtrl = new OrderCtrl();
const router = Router();


router.post('/cart',authorize(),orderCtrl.CartAddProduct);

router.post('/cart-delete-item',authorize(),orderCtrl.CartDeleteProduct);

router.get('/list',authorize(),orderCtrl.getOrders);

router.post('/order',authorize(),orderCtrl.CreateOrder);

router.patch('/order/:orderId/:action',authorize(),orderCtrl.UpdateOrderStatus);



export default router;