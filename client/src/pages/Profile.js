import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css'; // Import the CSS file
import MyProfile from '../components/MyProfile';

function Profile() {
    return (
        <div>
            <MyProfile />
        </div>
    );
}

export default Profile;
