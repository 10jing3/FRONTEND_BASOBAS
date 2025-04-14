import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const EsewaPayment = ({ amount, roomId }) => {
  const SECRET_KEY = "8gBm/:&EnhH.1/q"; // Ideally move to env in production

  const [formData, setFormData] = useState({
    amount: amount.toString(),
    tax_amount: "0",
    total_amount: amount.toString(),
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: `http://localhost:5173/success/${roomId}/`,
    failure_url: "http://localhost:5173/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
  });

  // Signature Generation Function
  const generateSignature = ({
    total_amount,
    transaction_uuid,
    product_code,
  }) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, SECRET_KEY);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  // Update signature whenever necessary fields change
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code } = formData;
    const newSignature = generateSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });
    setFormData((prev) => ({ ...prev, signature: newSignature }));
  }, [formData.total_amount, formData.transaction_uuid]);

  // Handle amount change
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amount: newAmount,
      total_amount: newAmount,
    }));
  };

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      <div className="field hidden">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleAmountChange}
          required
        />
      </div>
      {/* Hidden Fields */}
      {[
        "tax_amount",
        "total_amount",
        "transaction_uuid",
        "product_code",
        "product_service_charge",
        "product_delivery_charge",
        "success_url",
        "failure_url",
        "signed_field_names",
        "signature",
      ].map((field) => (
        <input
          key={field}
          type="hidden"
          id={field}
          name={field}
          value={formData[field]}
          required
        />
      ))}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Pay via E-Sewa
      </button>{" "}
    </form>
  );
};

export default EsewaPayment;
