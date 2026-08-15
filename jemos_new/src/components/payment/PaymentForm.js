import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { LoadingBox, closeLoadingBox } from "../util/LoadingBox";
import DialogBox from "../util/DialogBox";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { InvoiceBody } from "../util/mailHTML/InvoiceBody";
import SavedCards from "./SavedCards";
import DialogBoxWithConfirmation from "../util/DialogBoxWithConfirmation";
import { priceOfCart, url } from "../util/Util";
import { useTranslation } from "react-i18next";
import {
  EMAIL_OF_USER_ROUTE,
  INVOICES_ROUTE,
  USER_ROUTE,
} from "../map/gpx/Resources";
import { apiUrl } from "../../config";

function PaymentForm({
  handlePaymentSuccess,
  setUserPack,
  userData,
  setCart,
  cart,
}) {
  const { t } = useTranslation();
  const [savedCards, setSavedCards] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFetch = await axios.get(apiUrl + USER_ROUTE + userData._id);

        let customerId = userFetch.data.stripeCustomerId;

        if (!customerId) {
          console.log("L'utilisateur n'a pas d'ID client Stripe.");

          const stripeResponse = await axios.post(
            `${apiUrl}/user/stripe-customer`,
            {
              email: userFetch.data.email,
            },
          );

          customerId = stripeResponse.data.customerId;

          await axios.put(apiUrl + USER_ROUTE + userFetch.data._id, {
            stripeCustomerId: customerId,
          });

          console.log("ID client Stripe attribué à l'utilisateur:", customerId);
        }

        const paymentMethodsResponse = await axios.get(
          `${apiUrl}/stripe/payment-methods/${customerId}`,
        );

        setSavedCards(paymentMethodsResponse.data);

        if (paymentMethodsResponse.data.length > 0) {
          console.log("Cartes enregistrées:", paymentMethodsResponse.data);
        } else {
          console.log("Aucune carte enregistrée pour ce client.");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations:",
          error,
        );
      }
    };

    fetchData();
  }, [userData._id]);

  /**
   * Crée une méthode de paiement en utilisant les informations de la carte.
   * Enregistre la carte si elle n'a pas été enregistrée précédemment.
   * @async
   */
  const createPaymentMethod = async () => {
    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.log(error.message);
        DialogBox({
          text: t("invalidCardNumber"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return null;
      }

      const existingCard = savedCards.find(
        (savedCard) => savedCard.card.last4 === paymentMethod.card.last4,
      );

      if (existingCard) {
        return existingCard.id;
      }

      const confirmSave = await DialogBoxWithConfirmation({
        title: t("saveCard"),
        text: t("saveCardText"),
        icon: "warning",
        cancelButtonText: t("no"),
        confirmButtonText: t("yes"),
      });

      if (confirmSave) {
        console.log("Carte sauvegardée pour de futurs paiements");
        await axios.post(`${apiUrl}/stripe/payment-methods/attach`, {
          paymentMethodId: paymentMethod.id,
          customerId: userData.stripeCustomerId,
        });
      }

      return paymentMethod.id;
    } catch (error) {
      console.log("Error creating payment method", error);
      return null;
    }
  };

  /**
   * Effectue le paiement avec la méthode de paiement fournie.
   * @async
   * @param {string} paymentMethodId - ID de la méthode de paiement
   * @returns {boolean} - true si le paiement a réussi, false sinon
   * @throws {Error} - Erreur lors du paiement
   */

  const makePayment = async (paymentMethodId) => {
    LoadingBox({
      title: t("loading"),
      text: t("progressPayment"),
      icon: "info",
    });
    try {
      const paymentResponse = await axios.post(
        `${apiUrl}/stripe/payment-intent`,
        {
          paymentMethodId,
          customerId: userData.stripeCustomerId,
          amount: priceOfCart(cart) * 100,
          currency: "eur",
          returnUrl: url,
        },
      );

      const paymentIntent = {
        status: paymentResponse.data.status,
        client_secret: paymentResponse.data.clientSecret,
      };

      if (paymentIntent.status === "succeeded") {
        console.log("Paiement réussi");
        setCart([]);
        return true;
      } else if (paymentIntent.status === "requires_action") {
        const { error } = await stripe.confirmCardPayment(
          paymentIntent.client_secret,
        );
        if (error) {
          console.log("Échec de l'authentification", error);
          return false;
        } else {
          console.log("Paiement réussi après authentification");
          setCart([]);
          return true;
        }
      } else {
        console.log("Échec du paiement");
        return false;
      }
    } catch (error) {
      closeLoadingBox();
      DialogBox({
        text: t("errorPayment"),
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log("Erreur lors du paiement", error);
      return false;
    }
  };

  /**
   * Effectue le paiement en utilisant la carte enregistrée spécifiée.
   *
   * @param {object} card - La carte enregistrée à utiliser pour le paiement.
   */
  const handlePayWithSavedCard = async (card) => {
    try {
      const paymentMethodId = card.id;
      const paymentSuccessful = await makePayment(paymentMethodId);
      if (paymentSuccessful) {
        await handleInvoiceAndEmail();
        handlePaymentSuccess();
        setUserPack("Premium");
        setSuccess(true);
        setCart([]);
      }
    } catch (error) {
      console.error("Erreur lors du paiement avec la carte enregistrée", error);
    }
  };

  /**
   * Crée une facture et envoie un email de confirmation.
   * @async
   * @throws {Error} - Erreur lors de la création de la facture ou de l'envoi de l'email
   *
   */

  const handleInvoiceAndEmail = async () => {
    await axios.post(apiUrl + INVOICES_ROUTE, {
      dateInvoice: new Date(),
      nameProduct: "Premium",
      priceProduct: 0.5,
      fileInvoice: "",
      user: userData._id,
    });
    const mainContentInvoice = `${MailTemplateHeader(
      "Votre facture",
    )}${InvoiceBody(userData)}`;
    const htmlMessage = MailHTMLTemplate(mainContentInvoice);
    await axios
      .post(apiUrl + EMAIL_OF_USER_ROUTE, {
        email: userData.email,
        subject: "Votre facture",
        message: htmlMessage,
      })
      .then((response) => {
        console.log("Email sent:", response.status, response.text);
        DialogBox({
          text: t("successPayment"),
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error("Email error:", error);
        DialogBox({
          text: t("errorSendMail"),
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  /**
   * Gère la suppression d'une carte enregistrée après confirmation de l'utilisateur.
   *
   * @param {object} card - La carte enregistrée à supprimer.
   */
  const handleRemoveSavedCard = async (card) => {
    const confirmRemove = await DialogBoxWithConfirmation({
      title: t("deleteCard"),
      text: t("deleteCardText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });

    if (confirmRemove) {
      try {
        await axios.delete(`${apiUrl}/stripe/payment-methods/${card.id}`);
        const updatedSavedCards = savedCards.filter((c) => c.id !== card.id);
        setSavedCards(updatedSavedCards);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la carte enregistrée",
          error,
        );
      }
    }
  };

  /**
   * Gère la soumission du formulaire de paiement, crée une méthode de paiement et effectue le paiement.
   *
   * @param {object} e - L'événement de soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("jest: handleSubmit appelé");
    const paymentMethodId = await createPaymentMethod();
    if (paymentMethodId) {
      const paymentSuccessful = await makePayment(paymentMethodId);
      if (paymentSuccessful) {
        await handleInvoiceAndEmail();
        setSuccess(true);
        handlePaymentSuccess();
        setUserPack("Premium");
        closeLoadingBox();
        DialogBox({
          text: t("paymentDone"),
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        closeLoadingBox();
        DialogBox({
          text: t("errorPayment"),
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <>
      {success ? (
        <div className="container mt-4 card mb-4 mb-xl-0 shadow pt-4 pb-4">
          <div className="alert alert-success mt-3">
            <h2>{t("successPayment")}</h2>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="container mt-4 card mb-4 mb-xl-0 shadow pt-4 pb-4">
                <h3 className="card-title text-center">{t("cartPayment")}</h3>
                <p className="card-text text-center">{t("enjoyCart")}</p>
                <h5 className="card-text text-center">
                  Total {"(" + priceOfCart(cart) + ")"} €
                </h5>
                <form onSubmit={handleSubmit} className="formCard">
                  <div className="form-group">
                    <label
                      id="card-info-label"
                      className="fw-bolder pb-2"
                      aria-label="Informations de la carte"
                    >
                      {t("cardInformations")}
                    </label>
                    <div id="card-info" aria-labelledby="card-info-label">
                      <CardElement className="form-control" />
                    </div>
                  </div>
                  <br />
                  <button type="submit" className="btn btn-success">
                    {t("pay")}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <SavedCards
                savedCards={savedCards}
                handlePayWithSavedCard={handlePayWithSavedCard}
                handleRemoveSavedCard={handleRemoveSavedCard}
                hidePaymentButton={false}
                hidePaymentFormButton={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentForm;
