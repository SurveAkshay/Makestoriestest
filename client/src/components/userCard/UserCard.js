import React from 'react';
import './card.css';

const UserCard = ({user}) => {
    return (
        
    <div className="profile-card-4 my-5 text-center">
        <img alt="User avatar" src={user.photo ? user.photo : window.location.origin + '/avatar.png'} className="img img-responsive" />
        <div className="profile-content">
            <div className="profile-name">
                {user.firstName+ " "}{user.lastName}
                <p>{user.email}</p>
            </div>
            <div className="profile-description">{user.address}</div>
            <div className="d-flex justify-content-between text-center">
                <div className="profile-overview">
                    <p>Age</p>
                    <h4>{user.age}</h4>
                </div>
                <div className="profile-overview">
                    <p>Phone</p>
                    <h4>{user.phone}</h4>
                </div>
            </div>
        </div>
    </div>

    )
}

export default UserCard;
