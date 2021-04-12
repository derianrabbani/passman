import axios from "axios";
import React, { Fragment, useContext, useState } from "react";
// import UserContext from "../../context/UserContext";
import AuthContext from "../../context/AuthContext";
import { useHistory, Link } from "react-router-dom";
import ErrorNotice from "../pages/ErrorNotice";
import Header from "./Header"

export default function Registration() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordCheck, setPasswordCheck] = useState()
    const [displayName, setDisplayName] = useState()
    const [error, setError] = useState()

    const history = useHistory()

    const { getLoggedIn } = useContext(AuthContext)
    // const { setUserData } = useContext(UserContext)

    const submit = async (e) => {

        e.preventDefault()

        try {

            const user = { email, password, passwordCheck, displayName }
            const userRes = await axios.post("https://passman-backend.vercel.app/users/registration", user);

            const login = { email, password }
            await axios.post("https://passman-backend.vercel.app/users/login", login);
            await axios.get("https://passman-backend.vercel.app/users/email/" + email)
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
            <form onSubmit={submit}>
                <div className="container container-registration">
                    <h1>Register</h1>
                    <p>Please fill in this form to create an account</p>
                    <hr />

                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}

                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>Password</strong>
                    </label>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>Repeat Password</strong>
                    </label>
                    <input type="password" placeholder="Repeat Email" onChange={(e) => setPasswordCheck(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>Display Name</strong>
                    </label>
                    <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />

                    <hr />
                    <p>By Creating an account you agree to our <a href="#">Terms & Privacy</a></p>
                    <button type="submit" className="btn-register">Register</button>

                    <div className="container-sign-in">
                        <p>Already have an account? <Link to="/login">Sign in</Link>.</p>
                    </div>
                </div>

            </form>
        </Fragment>
    )
};
