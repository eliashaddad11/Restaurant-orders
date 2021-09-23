
import express from 'express';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import addressRoutes from './routes/address';
import branchRoutes from './routes/branch';
import shopRoutes from './routes/shop';

function setRoutes(app:any): void {

    const router = express.Router();

    router.use('/auth', authRoutes);

    router.use('/category',categoryRoutes)

    router.use('/product',productRoutes)

    router.use('/address',addressRoutes)
    
    router.use('/branch',branchRoutes)

    router.use('/shop',shopRoutes)

    // Apply the routes to our application with the prefix /api
    app.use('/api',router );

}



export default setRoutes;