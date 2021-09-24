import { model, Schema} from 'mongoose';

const productSchema = new Schema({
    title: {
      type: String,
      unique: true,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  });

const Product = model('Product', productSchema);
  
export default Product;
  