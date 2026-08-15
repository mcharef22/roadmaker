import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import DialogBox from "../util/DialogBox";
import SavedCards from "./SavedCards";
import DialogBoxWithConfirmation from "../util/DialogBoxWithConfirmation";
import LoadingBox, { closeLoadingBox } from "../util/LoadingBox";
import { useTranslation } from "react-i18next";
import { USER_ROUTE } from "../map/gpx/Resources";
import { apiUrl } from "../../config";

function CreditCards({ userData }) {
  const [savedCards, setSavedCards] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl + USER_ROUTE + userData._id);

        if (!response.data.stripeCustomerId) {
          console.log("L'utilisateur n'a pas d'ID client Stripe.");

          const stripeResponse = await axios.post(
            `${apiUrl}/user/stripe-customer`,
            {
              email: response.data.email,
            },
          );

          const customerId = stripeResponse.data.customerId;

          await axios.put(apiUrl + USER_ROUTE + response.data._id, {
            stripeCustomerId: customerId,
          });

          console.log("ID client Stripe attribué à l'utilisateur:", customerId);

          const paymentMethodsResponse = await axios.get(
            `${apiUrl}/stripe/payment-methods/${customerId}`,
          );

          setSavedCards(paymentMethodsResponse.data);
        } else {
          const paymentMethodsResponse = await axios.get(
            `${apiUrl}/stripe/payment-methods/${response.data.stripeCustomerId}`,
          );

          setSavedCards(paymentMethodsResponse.data);
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
  const createPaymentMethod = async () => {
    try {
      LoadingBox({
        text: t("addCardLoading"),
        icon: "info",
      });
      // Obtenir les références aux composants individuels
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      // Vérifier si les champs sont valides
      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        console.error("Champs de carte invalides");
        return null;
      }

      // Créer la méthode de paiement avec les données des composants individuels
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (error) {
        console.log(error.message);
        closeLoadingBox();
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
        closeLoadingBox();
        DialogBox({
          text: t("cardAlreadyExist"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return existingCard.id;
      }

      await axios.post(`${apiUrl}/stripe/payment-methods/attach`, {
        paymentMethodId: paymentMethod.id,
        customerId: userData.stripeCustomerId,
      });
      closeLoadingBox();
      DialogBox({
        text: t("addCardSuccess"),
        icon: "success",
        confirmButtonText: "OK",
      });

      setSavedCards((prevCards) => [...prevCards, paymentMethod]);

      return paymentMethod.id;
    } catch (error) {
      closeLoadingBox();
      DialogBox({
        text: t("addCardError"),
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(
        "Erreur lors de la création de la méthode de paiement",
        error,
      );
      return null;
    }
  };

  const handleRemoveAllSavedCards = async () => {
    const confirmRemove = await DialogBoxWithConfirmation({
      title: t("deleteCards"),
      text: t("deleteCardsText"),
      icon: "warning",
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (confirmRemove) {
      try {
        for (const card of savedCards) {
          await axios.delete(`${apiUrl}/stripe/payment-methods/${card.id}`);
        }
        setSavedCards([]);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression des cartes enregistrées",
          error,
        );
      }
    }
  };

  const handleRemoveSavedCard = async (card) => {
    const confirmRemove = await DialogBoxWithConfirmation({
      title: t("deleteCard"),
      text: t("deleteCardText"),
      icon: "warning",
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });

    if (confirmRemove) {
      try {
        await axios.delete(`${apiUrl}/stripe/payment-methods/${card.id}`);
        setSavedCards((prevCards) => prevCards.filter((c) => c.id !== card.id));
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la carte enregistrée",
          error,
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("jest: handleSubmit appelé");
    await createPaymentMethod();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mt-4">
          <div className="card mb-4 shadow">
            <form onSubmit={handleSubmit} className="formCard">
              <div className="card-header fw-bolder bg-light">
                {t("cardInformations")}
              </div>
              <div className="card-body">
                <label
                  htmlFor="cardNumber"
                  className="fw-bolder"
                  aria-label="Numéro de carte"
                >
                  {t("cardNumber")}
                </label>
                <CardNumberElement className="form-control" id="cardNumber" />
                <br />
                <div className="row">
                  <div className="col">
                    <label
                      htmlFor="cardExpiry"
                      className="fw-bolder"
                      aria-label="Date d'expiration"
                    >
                      {t("expirationDate")}
                    </label>
                    <CardExpiryElement
                      className="form-control"
                      id="cardExpiry"
                    />
                  </div>
                  <div className="col">
                    <label
                      htmlFor="cardCvc"
                      className="fw-bolder"
                      aria-label="Code de vérification (CVV)"
                    >
                      {t("verificationCode")}
                    </label>
                    <CardCvcElement className="form-control" id="cardCvc" />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success ">
                  {t("addCard")}
                </button>
              </div>
              <br />
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <SavedCards
            savedCards={savedCards}
            handleRemoveSavedCard={handleRemoveSavedCard}
            hidePaymentBouton={true}
            hidePaymentFormBouton={true}
          />
          {savedCards.length > 0 && (
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-danger"
                onClick={handleRemoveAllSavedCards}
              >
                {t("deleteCardsBtn")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditCards;
