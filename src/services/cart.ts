import Product from "../models/product";
import User from "../models/user";


 async function addToCart(userid,product) 
 {
    const user=await User.findOne({_id:userid});

    const cartProductIndex = user.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...user.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = user.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    user.cart = updatedCart;
    return await  user.save();
  };


  async function removeFromCart(userid,productId) 
  {
        const user=await User.findOne({_id:userid});

        const updatedCartItems = user.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        user.cart.items = updatedCartItems;
        return await user.save();
  };
  
  async function clearCart (userid) {

    const user=await User.findOne({_id:userid});
    user.cart = { items: [] };
    return await  user.save();

  };

  export default {
    addToCart,
    clearCart,
    removeFromCart
};
