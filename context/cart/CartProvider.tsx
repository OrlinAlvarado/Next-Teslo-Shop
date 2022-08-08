import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct, ShippingAddress, IOrder } from '../../interfaces';
import Cookie from 'js-cookie'
import tesloApi from '../../api/tesloApi';
import axios, { AxiosError } from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const getAddress = () => {
  const address: ShippingAddress ={
    firstName: Cookie.get('firstName') || '',
    lastName:  Cookie.get('lastName') || '',
    address:   Cookie.get('address') || '',
    address2:  Cookie.get('address2') || '',
    zip:       Cookie.get('zip') || '',
    city:      Cookie.get('city') || '',
    country:   Cookie.get('country') || '',
    phone:     Cookie.get('phone') || '' 
  }
  
  return address;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: getAddress()
};



export const CartProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  
  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
    } catch (error) {
      console.log(error);
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
    }
  }, []);
  
  useEffect(() => {
    try {
      dispatch({ type: '[Cart] - Load address from cookie', payload: getAddress() });
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart])
  
  
  useEffect(() => {
    
    const numberOfItems = state.cart.reduce((prev, product) => prev + product.quantity, 0);
    const subTotal = state.cart.reduce((prev, product) => prev + product.price * product.quantity, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    }
    
    dispatch({ type: '[Cart] - Update cart summary', payload: orderSummary });
  }, [state.cart])
  
  
  const addProductToCart = (product: ICartProduct) => {
    // dispatch({
    //   type: '[Cart] - Add Product',
    //   payload: product,
    // });
    
    const productInCart = state.cart.some( p =>  p._id === product._id );
    
    if( !productInCart ) return dispatch({ type: '[Cart] - Update Products in cart', payload: [...state.cart, product] });
    
    const productInCartButDifferentSize = state.cart.some( p =>  p._id === product._id && p.size === product.size );
    if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update Products in cart', payload: [...state.cart, product] });
    
    
    
    const updatedProducts = state.cart.map( p => { 
      if( p._id !== product._id ) return p;
      if( p.size !== product.size ) return p;
      
      //Actualizar la cantidad
      
      p.quantity += product.quantity;
      return p;
    
    })
    dispatch({ type: '[Cart] - Update Products in cart', payload: updatedProducts });
  }
  
  const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product });
  }
  
  const removeCartProduct = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product });
  }
  
  const updateAddress = ( address: ShippingAddress ) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({ type: '[Cart] - Update address', payload: address });
  }
  
  const createOrder = async(): Promise<{ hasError: boolean, message: string}> => {
    
    if ( !state.shippingAddress ) {
      throw new Error('No hay dirección de entrega');
    }
    
    const body: IOrder = {
      orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }
    
    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      
      dispatch({ type: '[Cart] - Order complete'})
      
      return {
        hasError: false,
        message: data._id!
      }
      
    } catch (error) {
      if ( axios.isAxiosError(error) ) {
        const err = error as any
        return {
          hasError: true,
          message: err.response?.data.message
        }
      }
      
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }
  }
    
  return (
   <CartContext.Provider
     value={{
        ...state,
        
        //Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        
        // Orders
        createOrder
     }}
    >
       {children}
    </CartContext.Provider>
  );
};