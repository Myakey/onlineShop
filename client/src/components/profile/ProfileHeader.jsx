import React, { useState } from "react";

const ProfileHeader = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profil berhasil disimpan!");
  };

  const handlePhotoClick = () => {
    alert("Fitur upload foto akan dibuka di sini");
  };

  return (
    <div>
      <div className="profile-header">
        <div className="profile-photo" onClick={handlePhotoClick}>
          <img src="https://via.placeholder.com/120/667eea/ffffff?text=User" alt="Profile" />
        </div>
        <p className="upload-hint">Klik di foto untuk mengubah foto profil!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nama Depan</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nama depan" />
          </div>
          <div className="form-group">
            <label>Nama Belakang</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nama belakang" />
          </div>
        </div>

        <div className="form-group">
          <label>Tanggal Lahir</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Nomor HP</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xx xxxx xxxx" />
        </div>

        <button type="submit" className="save-btn">Simpan</button>
      </form>
    </div>
  );
};

export default ProfileHeader;
