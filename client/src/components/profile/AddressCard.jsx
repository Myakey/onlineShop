import React from "react";

const AddressCard = ({ title, text, onDelete, onEdit }) => {
  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p>{text}</p>
      </div>
      <div className="space-x-2">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={onDelete}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
