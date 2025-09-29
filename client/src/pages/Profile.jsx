import React from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import AddressList from "../components/profile/AddressList";

const Profile = () => {
  return (
    <div className="container">
      <a href="#" className="back-btn">← Back</a>
      
      <ProfileHeader />

      <div className="divider"></div>

      <div className="address-section">
        <h3 className="section-title">Alamat</h3>
        <AddressList />
      </div>
    </div>
  );
};

export default Profile;
