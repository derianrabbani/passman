import React, { useEffect, useContext, Fragment, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Header from "./Header"

export default function Home() {

    return (

        <Fragment>
            <Header />
            <div className="clear" />
            <div className="container-data">
                Selamat datang di aplikasi Password Manager.

                Aplikasi ini menggunakan Encryption AES 256
            </div>
        </Fragment>
    )
};
