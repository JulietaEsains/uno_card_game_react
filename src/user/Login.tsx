import { useState } from "react";
import { login } from "../user/userServices.ts";
import Input from "../common_components/Input.tsx";
import Button from "../common_components/Button.tsx"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert("Por favor llenar todos los campos.");
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            alert("Credenciales incorrectas. Intente nuevamente.")
            throw err;
        }
    }

    return(
        <div className="user-form">
            <form autoComplete="off">
                <label>
                    Email: <Input 
                        name = "email"
                        type = "email"
                        value = {email}
                        onChange = {(event) => setEmail(event.target.value)}
                    />
                </label>
                <br />
                <label>
                    Contraseña: <Input 
                        name = "password"
                        type = "password"
                        value = {password}
                        onChange = {(event) => setPassword(event.target.value)}
                    />
                </label>

                <div className="btns-container btn-confirm">
                    <Button 
                        value = "Confirmar"
                        onClick = {handleLogin}
                    />
                </div>
            </form>
        </div>
    );
} 