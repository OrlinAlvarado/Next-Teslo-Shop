import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';

type Data = 
| { message: string}
| IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    
    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);
        default:
            return res.status(400).json({ message: 'Metodo no permitido' });
    }
    
    
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = ''} = req.query
    
    if(q.length === 0) {
        return res.status(400).json({ message: 'Debe ingresar una palabra para buscar' })
    }
    
    q = q.toString().toLowerCase();
    
    db.connect();
    
    const products = await Product
    .find({ 
        $text: { $search: q }
    })
    .select('title images price inStock slug -_id')
    .lean();
    
    if(!products) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
    
    db.disconnect();
    
    return res.status(200).json(products);
}
