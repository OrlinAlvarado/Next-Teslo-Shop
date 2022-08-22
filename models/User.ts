import mongoose, { Schema, model, Model } from 'mongoose'
import { IUser } from '../interfaces';

const userShema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,
        enum: {
            values: ['admin', 'client', 'super-user', 'SEO'],
            message: '{VALUE} is not a valid role',
            default: 'client',
            required: true
        }
     },
}, 
{
    timestamps: true
})


const User: Model<IUser> = mongoose.models.User ||  model('User', userShema);

export default User;
