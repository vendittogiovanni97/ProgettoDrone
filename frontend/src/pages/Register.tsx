import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const RegisterPage: React.FC = () =>
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState ("");                                      //Parametri utili per la pagina
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validazioneEmail = (email:string) =>
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);                                                  //metodo per validazione Email
    }

    const validazionePassword =(password:string) =>
    {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;                //metodo validazione Password
        return passwordRegex.test(password);
    }

    const handleRegister = (e: React.FormEvent) =>              //Metodo per la registrazione
    {
        e.preventDefault();
        if (!validazioneEmail(email)) {
            setError("Formato Email non valido!");                                                 //condizioni da rispettare per la registrazione
            return;
        }
        if (!validazionePassword(password)) {
            setError("La password deve essere almeno di 8 caratteri e contenere almeno una lettera ed un numero.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Le password non coincidono!");
            return;
        }

        const existingUser = localStorage.getItem("registeredUser");                                    //controllo per vedere se già esiste un utente salvato con quei dati
        if (existingUser) {
            const { email: savedEmail } = JSON.parse(existingUser);
            if (savedEmail === email) {
                setError("Questa email è già registrata!");
                return;
            }
        }

        // Salva l'utente nel localStorage
        const userData = JSON.stringify({ email, password });
        localStorage.setItem("registeredUser", userData);                                                          //sennò salva

        alert("Registrazione avvenuta con successo! Ora puoi effettuare il login.");
        navigate("/login");
    };
    return (
        <div className="register-container">
            <h2>Registrazione</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Conferma Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Registrati</button>
            </form>
            <p>Hai già un account? <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}>Accedi</span></p>
        </div>
    );
};

export default RegisterPage;