import React from "react";
import StripeContainer from "./StripeContainer";
import axios from "axios";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { MailBodySubscribe } from "../util/mailHTML/MailBodySubscribe";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { EMAIL_OF_USER_ROUTE, USER_ROUTE } from "../map/gpx/Resources";
import { apiUrl } from "../../config";

const PaymentPage = ({ setUserPack, userData, setCart, setPack, cart }) => {
  const mainContentSubscribe = `${MailTemplateHeader(
    "Abonnement à Premium"
  )}${MailBodySubscribe(userData)}`;

  const handlePaymentSuccess = async () => {
    const htmlMessage = MailHTMLTemplate(mainContentSubscribe);

    let dataSend = {
      email: userData.email,
      subject: "Abonnement à Premium",
      message: htmlMessage,
    };

    try {
      await axios.put(apiUrl + USER_ROUTE + userData._id, {
        pack: "Premium",
      });
      setPack("Premium");

      await axios.post(apiUrl + EMAIL_OF_USER_ROUTE, dataSend);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card-body">
          <StripeContainer
            handlePaymentSuccess={handlePaymentSuccess}
            setUserPack={setUserPack}
            userData={userData}
            setCart={setCart}
            cart={cart}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
