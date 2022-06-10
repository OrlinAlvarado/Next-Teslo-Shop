import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '../../interfaces';
import Cookie from 'js-cookie'

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName : string;
  address  : string;
  address2?: string;
  zip      : string;
  city     : string;
  country  : string;
  phone    : string;
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
    
  return (
   <CartContext.Provider
     value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress
     }}
    >
       {children}
    </CartContext.Provider>
  );
};