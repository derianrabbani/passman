import React, { Fragment, useEffect, useState } from "react"
import { useHistory, Link } from "react-router-dom";
import Header from "../../pages/Header"
import Axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import Cookies from "js-cookie";

export default function Index() {

    const history = useHistory()

    const [dataTable, setDataTable] = useState()

    useEffect(() => {

        getData()

    }, [])

    const getData = async () => {

        const token = Cookies.get("loginToken") || ""

        const view = await Axios.get("http://localhost:5000/passman/", { headers: { "loginToken": token } })

        setDataTable(view.data.map((val, i) => (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td>
                    <Link className="btn-action" to={"/passman/form/" + val._id}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    &nbsp;|&nbsp;
                    <span className="btn-action" onClick={() => deleted(val._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    &nbsp;|&nbsp;
                    <span className="btn-action" onClick={() => showEncryption(val._id)}>
                        <FontAwesomeIcon icon={faEye} />
                    </span>
                </td>
            </tr>
        )))
    }

    const deleted = async (id) => {

        const token = Cookies.get("loginToken") || ""

        try {
            if (window.confirm("Are you sure delete this document ?")) {

                const token = localStorage.getItem("auth-token") || ""

                const deleted = await Axios.delete("http://localhost:5000/passman/delete/" + id, null, { headers: { "loginToken": token } })

                getData()

                history.push("/passman")
            }
        }
        catch (err) {

            console.log(err)
        }
    }

    const showEncryption = async (id) => {
        const token = Cookies.get("loginToken") || ""
        try {

            const showPassword = await Axios.get("http://localhost:5000/passman/" + id, { headers: { "loginToken": token } })

            alert("Password : " + showPassword.data.password + "\n Pin : " + showPassword.data.pin)
        }
        catch (err) {

            console.log(err)
        }
    }

    return (
        <Fragment>
            <Header />
            <div className="clear" />
            <div className="container-data">
                <div className="container-button">
                    <button className="btn" onClick={() => history.push("/passman/form")}>Create</button>
                </div>
                <table className="table table-no-spacing">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable}
                    </tbody>
                </table>
            </div>
        </Fragment >
    )
}