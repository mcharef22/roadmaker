import React from "react";
import { useTranslation } from "react-i18next";
import ThemeSelector from "../util/ThemeSelector";

const DropDownPersonnalSpace = ({
  setVisibleComponent,
  disconnectUser,
  avatar,
}) => {
  const { t } = useTranslation();
  return (
    <div className="dropdown">
      {avatar ? (
        <img
          src={avatar}
          alt="Avatar de l'utilisateur"
          className=" rounded-circle shadow"
          id="userInfoDropDown"
          data-bs-toggle="dropdown"
          title={t("mySpace")}
          aria-label="MySpace"
        />
      ) : (
        <button
          className="btn btn-custom-large shadow-none mb-2 fs-2 mt-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title={t("mySpace")}
          aria-label="MySpace"
        >
          <i className="bi bi-person-circle text-white "></i>
        </button>
      )}
      <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("MyProfile");
            }}
            title={t("myInformations")}
            aria-label="Mes informations"
          >
            {t("myInformations")}
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("BillingAdress");
            }}
            title={t("myBillingAddress")}
            aria-label="Mes adresses de facturation"
          >
            {t("myBillingAddress")}
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("Subscriptions");
            }}
            title={t("mySubscriptions")}
            aria-label="Subscriptions"
          >
            {t("mySubscriptions")}
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("Invoices");
            }}
            title={t("myInvoices")}
            aria-label="Invoices"
          >
            {t("myInvoices")}
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("CreditCard");
            }}
            title={t("myCreditCards")}
            aria-label="Card"
          >
            {t("myCreditCards")}
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => {
              setVisibleComponent("Contact");
            }}
            title="Contact"
            aria-label="Contact"
          >
            Contact
          </button>
          <button
            aria-label="logOut"
            className="buttonDisconnect mt-2 fw-bold"
            type="button"
            onClick={() => {
              disconnectUser();
            }}
            title={t("logOut")}
          >
            {t("logOut")}
          </button>
          <hr className={" mx-3"} />
          <div className={"ms-3"}>
            <h6 className={"fw-bolder"}>Thème</h6>
            <ThemeSelector />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DropDownPersonnalSpace;
