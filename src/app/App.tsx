import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StateLoggedInRoute } from "../common_components/LoggedInRoute.tsx";
import Profile from "../profile/Profile.tsx";
import Login from "../user/Login.tsx";
import Register from "../user/Register.tsx";
import Home from "./Home.tsx";
import Game from "./Game.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<StateLoggedInRoute component={Profile}/>}/>
                    <Route path="/game" element={<StateLoggedInRoute component={Game} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}