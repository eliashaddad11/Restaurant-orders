import { model, Schema} from 'mongoose';

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const branchSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    location: {
      type: pointSchema,
      index: '2dsphere'
   },
   legacy : [ {
     type:Number,
     required:true
   }],
    
  });
  

const Branch = model('Branch', branchSchema);

  
export default Branch;
  