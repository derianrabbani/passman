import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";
import ViewPassman from "./components/modules/passman/View";
import FormPassman from "./components/modules/passman/Form";

export default function Router() {

    const { loggedIn } = useContext(AuthContext)

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />

                {/* Login */}
                {loggedIn === false && (
                    <>
                        <Route path="/login" component={Login} />
                        <Route path="/registration" component={Registration} />
                    </>
                )}

                {/* Passman */}
                {loggedIn === true && (
                    <>
                        <Route exact path="/passman" component={ViewPassman} />
                        <Route path="/passman/form/:idPassman?" component={FormPassman} />
                    </>
                )}

            </Switch>
        </BrowserRouter>
    )
}
