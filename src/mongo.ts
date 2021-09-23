import mongoose from 'mongoose';

async function setMongo(): Promise<any> {

  let mongodbURI:string='';

  if (process.env.NODE_ENV === 'test') 
  {
      if(process.env.MONGODB_TEST_URI)
        mongodbURI = process.env.MONGODB_TEST_URI;
  } 
  else 
  {
      if (process.env.MONGODB_URI)
        mongodbURI = process.env.MONGODB_URI;
  }
  
  mongoose.set('useCreateIndex', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);

  // Connect to MongoDB using Mongoose
  await mongoose.connect(mongodbURI);
  console.log('Connected to MongoDB');
}

export default setMongo;
