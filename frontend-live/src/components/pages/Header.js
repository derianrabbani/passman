import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Logout from "./Logout";

export default function Header() {

    const { loggedIn } = useContext(AuthContext)

    return (
        <header className="top-navigation">
            <ul>
                <li><Link to="/">Home</Link></li>

                {loggedIn === false && (
                    <>
                        <li><Link to="/registration">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}

                {loggedIn === true && (
                    <>
                        <li><Link to="/passman">Password Manager</Link></li>
                        <Logout />
                    </>
                )}
            </ul>
        </header>
    )
};
