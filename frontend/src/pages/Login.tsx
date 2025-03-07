
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);                    //parametri utili per la pag. Login
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validazioneEmail = (email:string) =>
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                    //metodo con regex per validazione email
        return emailRegex.test(email);
    };
    const validazionePassword = (password:string) =>
    {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;     //metodo con regex per validazione password
        return passwordRegex.test(password);
    };
    const handleLogin = () => {                             //metodo per gestire il login
        if (!validazioneEmail(email)) {
            setError("Formato Email non valido!");                          //Se Validazione Email false, manda errore
            return;
        }
        if (!validazionePassword(password)) {                               //Se Validazione Password false, manda errore
            setError("La Password deve essere almeno di 8 caratteri e contenere almeno una lettera ed un numero");
            return;
        }
        setError("");
        if (rememberMe) {
            localStorage.setItem("userEmail", email);                       //Se aggiorno pagina rimango con i dati inseriti
            localStorage.setItem("userPassword", password);
        }
        alert("Login Avvenuto con Successo!");
    };
    return (
        <div className="login-container">
            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="login-checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    /> Ricordami
                </label>
                <a href="#!">Password Dimenticata?</a>
            </div>
            <button onClick={handleLogin}>Accedi</button>
            <div>
                <p>Non Hai Già un Account? <a href="#!" onClick={() => navigate("/register")} >Registrati</a></p>
            </div>
            </div>
    );
};

export default LoginPage;
