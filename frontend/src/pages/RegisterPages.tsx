/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEventHandler, useContext, useState } from "react";
import "./css/register.css";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/Auth.Provider";
import { RegisterForm } from "../types/Register.Form.Type";

export function RegisterPages() {
  const { register } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const registerData: RegisterForm = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    console.log("dati", registerData);
    try {
      const responseBody = await register(registerData);
      if (responseBody) {
        setSuccess(true);
        // TODO: aggiungere messaggio per il client reg successfull
      } else {
        setError("Si è verificato un errore durante la registrazione.");
      }
    } catch (err) {
      setError("Si è verificato un errore durante la registrazione.");
      console.error(err);
    }
    alert("Registrazione avvenuta con successo!");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <button type="submit">Registrati</button>
        </div>
      </form>

      <div>
        <p>
          Sei già registrato? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
