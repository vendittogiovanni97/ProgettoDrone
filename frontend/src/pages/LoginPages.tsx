import { useContext, useState } from "react"
import './css/login.css'
import { Link } from "react-router";
import { AuthContext } from "../context/Auth.Provider";
import { LoginForm } from "../types/Login.Form.Type";

export function LoginPages() {
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const {login} = useContext(AuthContext)

  const handleSubmit = async () => {
    const dataLogin: LoginForm = {
      email,
      password
    }
    const response = await login(dataLogin)
    if(response) {
      console.log('login succesfull')
    }
  }
  return (
    <div className="login-container">
      <h1>Login</h1>
        <input onChange={(e)=> setEmail(e.target.value)}type="text" name="Email" placeholder="inserisci email"/>
        <input onChange={(e)=> setPassword(e.target.value)}type="text" name="password" placeholder="inserisci password"/>
        <button onClick={handleSubmit}>Login</button>
        <p>Non hai un account? <Link to="/register">Registrati</Link></p>
    </div>
  )
} 
