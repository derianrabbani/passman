import React, { createContext, useEffect, useState } from 'react'
import Axios from "axios";

const AuthContext = createContext()

function AuthContextProvider(props) {

    const [loggedIn, setLoggedIn] = useState(undefined)

    async function getLoggedIn() {

        const loggedInRes = await Axios.post("https://passman-backend.vercel.app/users/checkToken")


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