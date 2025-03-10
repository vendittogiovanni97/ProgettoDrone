import mongoose, { Schema, Document, mongo } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//console.log('Dati dello userSchema',  UserSchema)
const User = mongoose.model<IUser>('User', UserSchema);
console.log('Modello User creato:', User.collection.name)
export default User
