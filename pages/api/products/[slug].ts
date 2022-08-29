import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';

type Data = 
| { message: string}
| IProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);
        default:
            return res.status(400).json({ message: 'Metodo no permitido' });
    }
    
    
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug } = req.query
    
    db.connect();
    
    const product = await Product.findOne({ slug })
    
    if(!product) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
    
    db.disconnect();
    
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    })
    
    return res.status(200).json(product);
}
