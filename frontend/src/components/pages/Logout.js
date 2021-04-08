import React, { useContext } from 'react'
import { useHistory } from "react-router-dom";
import Axios from "axios";
import AuthContext from "../../context/AuthContext";

export default function Logout() {

    const { getLoggedIn } = useContext(AuthContext)
    const history = useHistory()

    async function logout(e) {

        e.preventDefault()

        await Axios.get("http://localhost:5000/users/logout")
        await getLoggedIn()

        history.push("/")
    }

    return (
        <li className="right-menu"><a onClick={(e) => logout(e)}>Logout</a></li>
    )
}
