import React, { createContext, useEffect, useState } from 'react'
import Axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext()

function AuthContextProvider(props) {

    const [loggedIn, setLoggedIn] = useState(undefined)

    async function getLoggedIn() {

        const token = Cookies.get("loginToken") || ""

        const loggedInRes = await Axios.post("http://localhost:5000/users/checkToken", null, { headers: { "loginToken": token } })

        setLoggedIn(loggedInRes.data)
    }

    useEffect(() => {
        getLoggedIn()
    }, [])

    return (
        <>
            <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>
                {props.children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthContext
export { AuthContextProvider }