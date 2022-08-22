import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, User, Product } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number; //Proctos con menos de 10 unidades
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    db.connect();
    
    // const numberOfOrders = await Order.count()
    // const paidOrders = await Order.find({ isPaid: true }).count()
    // const numberOfClients = await User.find({ role: 'user'}).count()
    // const numberOfProducts = await Product.count()
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count()
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count()
    
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory ,
    ] = await Promise.all([
        await Order.count(),
        await Order.find({ isPaid: true }).count(),
        await User.find({ role: 'user'}).count(),
        await Product.count(),
        await Product.find({ inStock: 0 }).count(),
        await Product.find({ inStock: { $lte: 10 } }).count(),
    ])
    
    db.disconnect();
    const result = {
        paidOrders,
        numberOfOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    }
    
    return res.status(200).json(result)
}