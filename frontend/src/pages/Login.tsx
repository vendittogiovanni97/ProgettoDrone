import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");                                                                   //Parametri utili per la pagina
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validazioneEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                                                            //metodo validazione Email
        return emailRegex.test(email);
    };

    const validazionePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;                                             //metodo validazione Password
        return passwordRegex.test(password);
    };

    const handleLogin = () => {
        if (!validazioneEmail(email)) {
            setError("Formato Email non valido!");                                                                 //Metodo Controllo Validazione
            return;
        }
        if (!validazionePassword(password)) {
            setError("La Password deve essere almeno di 8 caratteri e contenere almeno una lettera ed un numero.");
            return;
        }

        const storedUser = localStorage.getItem("registeredUser");
        if (!storedUser) {
            setError("Nessun account registrato con questa email.");                                                //Metodo per il Login, prima superi le due validazioni,
            return;                                                                                                 //poi controlla se c'è già un account registrato
        }

        const { email: savedEmail, password: savedPassword } = JSON.parse(storedUser);                              //salvi, ed all'accesso se sbagli uno dei due ti da errore

        if (email !== savedEmail || password !== savedPassword) {
            setError("Email o password errati!");
            return;
        }

        setError("");
        if (rememberMe) {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);
        }

        alert("Login Avvenuto con Successo!");
        navigate("/dashboard"); // Reindirizzamento alla Dashboard
    };

    return (
        <div className="login-container">
            <input
                type="email"
                placeholder="Email"
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
                <span
                    onClick={() => navigate("/forgot-password")}
                    style={{ color: "blue", cursor: "pointer" }}
                >
        Password Dimenticata?
    </span>
            </div>
            <button onClick={handleLogin}>Accedi</button>
            <div className="login-register">
                <p>Non Hai Già un Account?
                    <span onClick={() => navigate("/register")} style={{ color: "blue", cursor: "pointer",padding: 5}}>
                        Registrati
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

