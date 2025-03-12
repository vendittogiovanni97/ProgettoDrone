import mongoose from "mongoose";

const {Schema, model} = mongoose

const User = new Schema({
  username: {type: String, required: true},
  email: {type: String, require: true},
  password : {type: String, required: true}
})

const Users = model("users",  User)
console.log('Creazione schema users', Users)

export default Users