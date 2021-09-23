import { model, Schema} from 'mongoose';

const orderSchema = new Schema({
    products: [
      {
        product: { type: Schema.Types.ObjectId, required: true ,ref: 'product'},
        quantity: { type: Number, required: true }
      }
    ],
    user: {
      email: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    },
    branch:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'branch'
    },
    status:{
        type:Number,
        default:0    //0 pending 1 accepted 2 rejected 3 canceled
    }
  });
  const Order = model('Order', orderSchema);
  
  export default Order;