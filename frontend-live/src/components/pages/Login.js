import React, { Fragment, useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import logo from '../../assets/images/img_avatar2.png';
import ErrorNotice from "../pages/ErrorNotice";
import Header from "./Header"
import Cookies from "js-cookie";

export default function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState()

    const { getLoggedIn } = useContext(AuthContext)
    const history = useHistory()

    const submit = async (e) => {

        e.preventDefault()

        try {
            const user = { email, password }

            // const token = await axios.post("https://passman-backend.vercel.app/users/login", user);

            const token = await axios.post("https://passman-backend.vercel.app/users/login", user)
            Cookies.set("loginToken", token.data)
            await getLoggedIn()

            history.push("/")
        }
        catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    return (
        <Fragment>
            <Header />
            {error && (
                <div className="error-notice-login">
                    <ErrorNotice message={error} clearError={() => setError(undefined)} />
                </div>
            )}
            <form className="login-form" onSubmit={submit}>

                <div className="img-container">
                    <img src={logo} alt="Avatar" className="avatar" />
                </div>

                <div className="container">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit">Login</button>
                </div>

                <div className="container login-button" >
                    <label>
                        <input type="checkbox" defaultChecked={checked} onChange={() => setChecked(!checked)} /> Remember Me
                    </label>

                    <span className="forget-password"><Link to="/registration">Register</Link> or Forgot <a href="#">Password ?</a></span>
                </div>
            </form>
        </Fragment>

    )
};
