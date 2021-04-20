import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from "./context/UserContext";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";
import ViewPassman from "./components/modules/passman/View";
import FormPassman from "./components/modules/passman/Form";

import "./assets/styles/styles.css"
import axios from "axios";
import Cookies from "js-cookie";

export default function App() {

    useEffect(() => {

        const checkLoggedIn = async () => {

            const token = Cookies.get("loginCookies") || ""

            if (token != "") {

                const tokenRes = await axios.post("https://passman-backend.vercel.app/users/checkToken", null, { headers: { "auth-token": token } })

                if (tokenRes.data) {
                    setUserData({
                        token,
                        user: {
                            id: tokenRes.data._id,
                            displayName: tokenRes.data.displayName
                        }
                    })
                }
            }
        }

        checkLoggedIn()

    }, [])

    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    })

    return (
        <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/registration" component={Registration} />

                    {/* Passman */}
                    <Route exact path="/passman" component={ViewPassman} />
                    <Route path="/passman/form/:idPassman?" component={FormPassman} />
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    )
}