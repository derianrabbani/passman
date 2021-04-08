import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import Header from "../../pages/Header"
import { useHistory, useParams } from "react-router-dom";
import ErrorNotice from "../../pages/ErrorNotice";

export default function Form() {

    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pin, setPin] = useState("")
    const [error, setError] = useState()

    const history = useHistory()

    const { idPassman } = useParams()

    useEffect(() => {


        const loadData = async () => {

            if (idPassman) {

                const passman = await axios.get("http://localhost:5000/passman/" + idPassman)

                if (passman) {

                    setName(passman.data.name)
                    setEmail(passman.data.email)
                    setPassword(passman.data.password)
                    setPin(passman.data.pin)
                }

                setId(idPassman)
            }
        }

        loadData()
    }, [])

    const submit = async (e) => {

        e.preventDefault()

        try {

            if (id) {
                const passman = {
                    id,
                    name,
                    email,
                    password,
                    pin
                }
                const saved = await axios.post("http://localhost:5000/passman/update", passman)

                history.push("/passman")
            }
            else {
                const passman = {
                    name,
                    email,
                    password,
                    pin
                }
                const saved = await axios.post("http://localhost:5000/passman/create", passman)

                history.push("/passman")
            }
        }
        catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }

    }
    return (
        <Fragment>

            <Header />
            <div className="clear" />
            <div className="container-data">

                {error && (
                    <ErrorNotice message={error} clearError={() => setError(undefined)} />
                )}

                <form onSubmit={submit}>
                    <h1>Form Password Manager</h1>
                    <hr />

                    <label htmlFor="email">
                        <strong>Name</strong>
                    </label>
                    <input type="text" placeholder="Name" defaultValue={name} onChange={(e) => setName(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input type="text" placeholder="Email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>Password</strong>
                    </label>
                    <input type="password" placeholder="Password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} required />

                    <label htmlFor="email">
                        <strong>PIN</strong>
                    </label>
                    <input type="password" placeholder="PIN" defaultValue={pin} onChange={(e) => setPin(e.target.value)} required />

                    <hr />

                    <div className="form-button">
                        <button type="submit" className="btn-save">Submit</button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}