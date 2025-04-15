import React, { useEffect } from "react";

const KhaltiPaymentButton = () => {
  useEffect(() => {
    // Load the Khalti script
    const script = document.createElement("script");
    script.src =
      "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
    script.async = true;
    script.onload = () => {
      const config = {
        publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
        productIdentity: "1234567890",
        productName: "Dragon",
        productUrl: "http://gameofthrones.wikia.com/wiki/Dragons",
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
        eventHandler: {
          onSuccess(payload) {
            console.log("Payment Success:", payload);
            // You can call your backend API here for verification
          },
          onError(error) {
            console.error("Payment Error:", error);
          },
          onClose() {
            console.log("Khalti widget closed.");
          },
        },
      };

      // Initialize Khalti Checkout
      const checkout = new window.KhaltiCheckout(config);
      const btn = document.getElementById("khalti-button");

      if (btn) {
        btn.onclick = () => {
          checkout.show({ amount: 1000 }); // Amount is in paisa (i.e. 1000 = Rs. 10)
        };
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return <button id="khalti-button">Pay with Khalti</button>;
};

export default KhaltiPaymentButton;
