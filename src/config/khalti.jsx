import React from "react";
import KhaltiCheckout from "khalti-checkout-web";

const KhaltiButton = () => {
  const handlePayment = () => {
    const config = {
      publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
      productIdentity: "1234567890",
      productName: "Drogon",
      productUrl: "http://gameofthrones.com/buy/Dragons",
      eventHandler: {
        onSuccess(payload) {
          console.log("Payment Success:", payload);
        },
        onError(error) {
          console.error("Payment Error:", error);
        },
        onClose() {
          console.log("Khalti widget closed.");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: 1000 });
  };

  return <button onClick={handlePayment}>Pay with Khalti</button>;
};

export default KhaltiButton;
