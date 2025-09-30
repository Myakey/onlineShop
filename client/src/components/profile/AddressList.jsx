import React from "react";
import AddressCard from "./AddressCard";

const AddressList = ({ addresses, onDeleteAddress, onEditAddress }) => {
  if (!addresses || addresses.length === 0) {
    return <p>Belum ada alamat</p>;
  }

  return (
    <div className="space-y-2">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          title={address.title}
          text={address.text}
          onDelete={() => onDeleteAddress(address.id)}
          onEdit={() => onEditAddress(address.id)}
        />
      ))}
    </div>
  );
};

export default AddressList;
