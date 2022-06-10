import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  
  useEffect(() => {
    checkToken()
  }, [])
  
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
      Cookies.remove('token');
      Cookies.remove('cart');
      router.reload();      
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