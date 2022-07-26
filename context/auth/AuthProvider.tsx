import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
  isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
};

export const AuthProvider:FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status} = useSession();
  const router = useRouter();
  
  // useEffect(() => {
  //   checkToken()
  // }, [])
  
  useEffect(() => {
    if( status === 'authenticated' ) {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser})
    }
  }, [ status, data ])
  
  const checkToken = async () => {
    
    if( !Cookies.get('token') ) {
      return
    }
    try {
      const { data } =  await tesloApi.get('/user/validate-token');
      
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user  });
    } catch (error) {
      Cookies.remove('token');
    }
  }
  const logOut = async () => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();
    // router.reload();      
    // Cookies.remove('token');
  }
  
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    
    try {
      const { data } =  await tesloApi.post('/user/login', { email, password });
      
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user  });
      return true;
      
    } catch (error) {
      return false
    }
  }
  
  const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user  });
      return {
        hasError: false
      };
    } catch (error) {
      if (axios.isAxiosError(error)){
        const { message } = error.response?.data as { message: string };
        return {
          hasError: true,
          message
        }
      }
      
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      }
    }
  }
  return (
   <AuthContext.Provider
     value={{
        ...state,
        
        //Methods
        loginUser,
        registerUser,
        logOut
     }}
    >
       {children}
    </AuthContext.Provider>
  );
};