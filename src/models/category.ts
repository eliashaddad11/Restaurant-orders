import { model, Schema} from 'mongoose';

const categorySchema = new Schema({
    title: {
      type: String,
      unique: true,
      required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    status:{
      type:Number,
      default:1
    },
    products: [
        { type: Schema.Types.ObjectId
          ,ref: 'Product'
        }
    ],
  });
  

const Category = model('Category', categorySchema);
  
export default Category;
  