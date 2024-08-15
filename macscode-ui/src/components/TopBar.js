import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';  // Import the user profile icon
import '../styles/TopBar.css';  // Ensure you have the corresponding CSS file for styling
import logoImage from '../icons/M.png';  // Import the image


const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="logo">
                <img src={logoImage} alt="Logo" />
            </div>
            <nav className="navigation">
                <a href="/problemset">Problemset</a>
                <a href="/discuss">Discuss</a>
            </nav>
            <div className="user-profile">
                <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-icon" />
            </div>
        </div>
    );
};

export default TopBar;
