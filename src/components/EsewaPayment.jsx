import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { FaCreditCard } from "react-icons/fa";

const EsewaPayment = ({ amount, roomId }) => {
  const SECRET_KEY = "8gBm/:&EnhH.1/q"; // Move to env in production

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
    // eslint-disable-next-line
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border border-green-100">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-green-100 rounded-full p-4 mb-2">
          <FaCreditCard className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Pay with E-Sewa
        </h2>
        <p className="text-gray-500 text-sm">
          Secure online payment for your booking
        </p>
      </div>
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="amount"
            className="block text-gray-700 font-medium mb-1"
          >
            Amount (NPR)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            readOnly
            disabled
            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
            min={1}
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          <img
            src="https://cdn.esewa.com.np/ui/images/esewa-icon-large.png"
            alt="eSewa"
            className="w-6 h-6 mr-2"
          />
          Pay via E-Sewa
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-400 text-center">
        You will be redirected to E-Sewa to complete your payment securely.
      </div>
    </div>
  );
};

export default EsewaPayment;
