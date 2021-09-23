import { model, Schema} from 'mongoose';

const userSchema = new Schema({
    email: {
      type: String,
      unique: true, lowercase: true, trim: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default: 'User'
    },
    status: {
      type:Number,
      required:true,
      default:1
    },
    address:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true
      }
    ],
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: { type: Number, required: true }
        }
      ]
    }
  });
  
  userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret.password;
    }
});

const User = model('User', userSchema);
  
export default User;
  