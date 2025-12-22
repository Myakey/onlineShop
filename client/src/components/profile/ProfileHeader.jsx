import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // ⬅️ ambil user dari context

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
    <div className="max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="profile-header text-center mb-6">
        <div
          className="profile-photo mx-auto cursor-pointer"
          onClick={handlePhotoClick}
        >
          <img
            src="https://via.placeholder.com/120/667eea/ffffff?text=User"
            alt="Profile"
            className="rounded-full"
          />
        </div>
        <p className="upload-hint text-sm text-gray-500 mt-2">
          Klik di foto untuk mengubah foto profil!
        </p>

        {/* 🔥 TOMBOL KHUSUS ADMIN */}
        {user?.role === "admin" && (
          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/store-settings")}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Store Settings
            </button>
          </div>
        )}
      </div>

      {/* FORM PROFILE */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
          />
        </div>

        <div className="form-row grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>Nama Depan</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nama depan"
            />
          </div>
          <div className="form-group">
            <label>Nama Belakang</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nama belakang"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tanggal Lahir</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nomor HP</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xx xxxx xxxx"
          />
        </div>

        <button type="submit" className="save-btn">
          Simpan
        </button>
      </form>
    </div>
  );
};

export default ProfileHeader;
