import { IUser } from '../../interfaces';
import { AuthState } from './';

type AutActionType =
   | { type: '[Auth] - Login', payload: IUser }
   | { type: '[Auth] - Logout' }
   

export const authReducer = (state: AuthState, action: AutActionType): AuthState => {
  switch (action.type) {
    case '[Auth] - Login':
       return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      };
    case '[Auth] - Logout':
       return {
        ...state,
        isLoggedIn: false,
        user: undefined
      };
    default:
    return state;
}
};