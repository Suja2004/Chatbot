import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navbarRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className={`navbar ${isOpen ? "open" : ""}`} ref={navbarRef}>
            <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <nav className={`menu ${isOpen ? "open" : ""}`}>
                <Link className="links" to="/user">Home</Link>
                <Link className="links" to="/chatbot">Chatbot</Link>
                <Link className="links" to="/therapy">Therapies</Link>
                <Link className="links" onClick={handleLogoutClick}>LogOut</Link>
            </nav>

            {showLogoutModal && (
                <div className="logout-modal">
                    <div className="modal-content">
                        <p>Are you sure you want to <br />log out?</p>
                        <button className="logbtn yes" onClick={handleLogout}>Yes</button>
                        <button className="logbtn no" onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
