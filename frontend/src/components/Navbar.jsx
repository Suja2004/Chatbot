import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for showing the logout confirmation
    const navbarRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close menu on click/touch outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        // Cleanup the event listeners on unmount
        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Show the confirmation popup
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setShowLogoutModal(false); // Close the modal after logout
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false); // Close the modal without logging out
    };

    return (
        <div className={`navbar ${isOpen ? "open" : ""}`} ref={navbarRef}>
            <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <nav className={`menu ${isOpen ? "open" : ""}`}>
                <Link className="links" to="/chatbot">Home</Link>
                <Link className="links" to="/chatbot">About</Link>
                <Link className="links" to="/chatbot">Services</Link>
                <Link className="links" onClick={handleLogoutClick}>LogOut</Link>
            </nav>

            {showLogoutModal && (
                <div className="logout-modal">
                    <div className="modal-content">
                        <p>Are you sure you want to log out?</p>
                        <button className="logbtn yes" onClick={handleLogout}>Yes</button>
                        <button className="logbtn no" onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
