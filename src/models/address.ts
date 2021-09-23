import { model, Schema} from 'mongoose';

const addressSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    coord:[{
      type:Number
    }],
    creator: 
    { 
        type: Schema.Types.ObjectId,ref: 'User'
    }
  });
  

const Address = model('Adress', addressSchema);
  
export default Address;
  