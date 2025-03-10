import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Funzione di validazione per l'email
const validazioneEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");                                     //Parametri utili
    const navigate = useNavigate();

    const handleResetPassword = () => {
        if (!validazioneEmail(email)) {
            setMessage("Inserisci un'email valida.");                               //parte il resetPassword dall'email
            return;
        }

                                                                                    // Controllo nel localStorage
        const storedUser = localStorage.getItem("registeredUser");

        if (!storedUser) {
            setMessage("Nessun account trovato con questa email.");
            return;
        }

        const { email: savedEmail} = JSON.parse(storedUser);

                                                                     // Verifica che l'email inserita corrisponda a quella salvata nel localStorage
        if (email !== savedEmail) {
            setMessage("Email non trovata.");
            return;
        }

                                                                 // Simulazione invio email (sostituisci con la logica di invio effettiva se necessario)
        setMessage(`La tua password è stata inviata all'email ${email}.`);

                                                                                        // Reindirizza dopo qualche secondo
        setTimeout(() => navigate("/login"), 3000);                         // Reindirizzamento al login dopo 3 secondi
    };

    return (
        <div className="forgot-password-container">
            <h2>Recupera Password</h2>
            <p>Inserisci la tua email per ricevere la password.</p>
            <input
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleResetPassword}>Invia richiesta</button>
            {message && <p style={{ color: "green" }}>{message}</p>}

            <p>
        <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}>
          Torna al login
        </span>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;
