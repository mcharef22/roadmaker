import { t } from "i18next";
import React from "react";

function SavedCards({
  savedCards,
  handlePayWithSavedCard,
  handleRemoveSavedCard,
  hidePaymentBouton,
}) {
  return (
    <>
      <div className="d-flex flex-sm-row flex-xs-column mt-4 justify-content-center align-items-center">
        <div className="col-xl-12">
          <div className="card mb-4 mb-xl-0 shadow">
            <div className="card-header fw-bolder bg-light">
              {t("savedCards")}
            </div>
            <div className="card-body">
              {savedCards.map((savedCard) => (
                <div key={savedCard.id} className="card mb-3">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h4>
                        {" "}
                        {t("card")} {savedCard.card.funding}
                      </h4>
                      <h5 className="card-title">
                        **** **** **** {savedCard.card.last4}
                        <br />
                        <small className="text-muted">
                          {savedCard.card.exp_month > 9
                            ? savedCard.card.exp_month
                            : "0" + savedCard.card.exp_month}
                          /{savedCard.card.exp_year}
                        </small>
                      </h5>
                      <small className="text-muted">
                        {savedCard.card.brand}
                      </small>
                    </div>
                    <button
                      onClick={() => handleRemoveSavedCard(savedCard)}
                      className="btn btn-danger"
                    >
                      🗑️
                    </button>
                  </div>
                  {!hidePaymentBouton && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <button
                        onClick={() => handlePayWithSavedCard(savedCard)}
                        className="btn btn-success"
                      >
                        {t("payWithThisCard")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {savedCards.length === 0 && (
                <p className="text-muted">{t("noCard")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedCards;
