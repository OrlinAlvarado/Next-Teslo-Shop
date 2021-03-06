import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedData } from '../../database';
import { Product, User } from '../../models';


export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    
    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'Not authorized' });
    }
      
    await db.connect();
    
    await User.deleteMany();
    await User.insertMany( seedData.initialData.users );
    

    await Product.deleteMany();
    await Product.insertMany(seedData.initialData.products);

    await db.disconnect();
    res.status(200).json({ message: 'Proceso realizado completamente' });
}