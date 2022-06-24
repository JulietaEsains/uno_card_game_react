import { useState } from "react";
import { createUser } from "../user/userServices.ts";
import Input from "../common_components/Input.tsx";
import Button from "../common_components/Button.tsx";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegistration = async (event) => {
        event.preventDefault();

        if (!name || !username || !email || !password) {
            alert("Por favor completar todos los campos.");
            return;
        }

        try {
            await createUser(name, username, email, password);
        } catch(err) {
            alert("El nombre de usuario ingresado no está disponible.")
            throw err
        }
    }

    return(
        <div className="user-form">
            <form autoComplete="off">
                <label>
                    Nombre: <Input 
                        name = "name"
                        type = "text"
                        value = {name}
                        onChange = {(event) => setName(event.target.value)}
                    />
                </label>
                <br />
                <label>
                    Nombre de usuario: <Input 
                        name = "username"
                        type = "text"
                        value = {username}
                        onChange = {(event) => setUsername(event.target.value)}
                    />
                </label>
                <br />
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
                        onClick = {handleRegistration}
                    />
                </div>
            </form>
        </div>
    );
}