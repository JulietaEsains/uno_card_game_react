import { Link, Outlet } from "react-router-dom";

export default function Home() {
    return(
        <div>
            <h1>UNO!</h1>

            <div className="links-container">
                <Link to="/login" className="link">Iniciar sesión</Link>
                <Link to="/register" className="link">Registrarse</Link>
                <Link to="/game" className="link">Jugar</Link>
            </div>

            <Outlet />
        </div>
    );
}