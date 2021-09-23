
import HttpException from "../exceptions/HttpException";
import Order from "../models/order";
import Product from "../models/product";
import User from "../models/user";
import cartService from "../services/cart";

class ShopCtrl  {

    CartAddProduct = async (req, res, next) => {

        const prodId = req.body.productId;

        try 
        {
            const prod = await Product.findById(prodId);

            if (!prod) {
                return next(new HttpException(404,'Could not find product'));
            }
            

            const result=await cartService.addToCart(req.user.userId,prod);
            
            res.status(201).json({
                message: 'Product added to Cart successfully!',
                cart: result.cart,
            });
        }
        catch(err)
        {
            next(new HttpException(500,'Something went wrong'));
        }
        
    };

    CartDeleteProduct = async (req, res, next) => {

        const prodId = req.body.productId;

        try
        {
            const result=await cartService.removeFromCart(req.user.userId,prodId)
            
            res.status(201).json({
                message: 'Product removed from Cart successfully!',
                cart: result.cart,
            });
        }
        catch(err)
        {
            next(new HttpException(500,'Something went wrong'));
        }
        
      };


    getOrders=async (req, res, next)=>{

        const userid = await req.user.userId;
           
        try
        {
            const order=await Order.find({'user.userId':userid});
            
            res.status(201).json({
                message: 'Orders fetched!',
                order: order,
            });
        }
        catch
        {
            next(new HttpException(500,'Something went wrong'));
        }
           
    }; 

    CreateOrder=async (req, res, next)=>{

        const branchId=req.body.branchId;

        /*const user = await req.user
            .populate('cart.items.productId')
            .execPopulate()*/

        const user= await User.findOne({_id:req.user.userId}); 

        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: i.productId  };
        });

        //console.log(products);

        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user.userId
            },
            products: products,
            branch:branchId
        });

        try
        {
            await order.save();
            
            await cartService.clearCart(req.user.userId);

            res.status(201).json({
                message: 'Order created successfully!',
                order: order,
            });
        }
        catch(err)
        {
            next(new HttpException(500,'Something went wrong'));
        }
           
    }; 
    
    UpdateOrderStatus=async (req, res, next)=>{

            const user=req.user;

            const orderid=req.params.orderId;
            const action=req.params.action;

            const order=await Order.findOne({_id:orderid});

            if(!order)
            {
                return next(new HttpException(404,'Could not find order'));
            }

            if(user.role==='User' && (action==='Accept' || action==='Reject') )
            {
                return next(new HttpException(401,'Unauthorized User'));
            }

            if(user.role==='Admin' && action==='Cancel' )
            {
                return next(new HttpException(401,'Unauthorized User'));
            }

            try 
            {

                switch(action) { 
                    case 'Accept': { 
                       //statements;
                       if(order.status!==0)
                        {
                            return next(new HttpException(401,'Not Allowed'))
                        }
                        order.status=3;
                        await order.save(); 
                        break; 
                    } 
                    case 'Reject': { 
                       //statements; 
                       if(order.status!==0)
                        {
                            return next(new HttpException(401,'Not Allowed'))
                        }
                        order.status=3;
                        await order.save(); 
                        break; 
                    } 
                    case 'Cancel': { 
                        //statements;
                        if(order.status!==0)
                        {
                            return next(new HttpException(401,'Not Allowed'))
                        }
                        order.status=3;
                        await order.save(); 
                        break; 
                     } 
                 }
                 
                 res.status(201).json({
                    message: 'Order updated successfully!',
                    order: order,
                });


            }
            catch(err)
            {

                next(new HttpException(500,''));
                    
            }

    };
   
      
}

export default ShopCtrl;