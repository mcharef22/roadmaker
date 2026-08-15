import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";
import { stripePublicKey } from "../../config";

const stripeTestPromise = loadStripe(stripePublicKey);

function StripeContainer({
  handlePaymentSuccess,
  setUserPack,
  userData,
  setCart,
  cart,
}) {
  return (
    <div className="container">
      <Elements stripe={stripeTestPromise}>
        <PaymentForm
          handlePaymentSuccess={handlePaymentSuccess}
          setUserPack={setUserPack}
          userData={userData}
          setCart={setCart}
          cart={cart}
        />
      </Elements>
    </div>
  );
}

export default StripeContainer;
