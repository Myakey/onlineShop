import React, { useState } from "react";
import Button from "../ui/Button";

const VoucherInput = ({ onApply }) => {
  const [code, setCode] = useState("");

  const handleApply = () => {
    onApply(code);
    setCode("");
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Masukkan kode voucher"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded flex-1"
      />
      <Button text="Apply" onClick={handleApply} />
    </div>
  );
};

export default VoucherInput;
