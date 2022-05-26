
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;
    role     : string;
    
    
    cretedAt?: string; 
    updatedAt?: string;
}