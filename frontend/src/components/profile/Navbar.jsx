import React from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.png";
import '../styles/Navbar.css';
import { useAuthentication } from "../auth";


function Navbar() {

    const {isAuthorized, logout} = useAuthentication();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="navbar">
            <Link to="/" className="navbar-logo-link">
                <img src={logo} alt="Logo" className="navbar-logo"/>
            </Link>
            <ul className="navbar-menu-left">
                <li>
                    <Link to="/why">Why Us?</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
            <ul className="navbar-menu-right">
                {isAuthorized ? (
                    <li>
                        <Link onClick={handleLogout} to="/logout" className="button-link">Logout</Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className="button-link-login">Log In</Link>
                        </li>
                        <li>
                            <Link to="/register" className="button-link">Register</Link>
                        </li>
                    </>
                )}
                
               
            </ul>
        </div>
    );
}

export default Navbar;