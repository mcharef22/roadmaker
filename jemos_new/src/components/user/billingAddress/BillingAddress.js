import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import DialogBox from "../../util/DialogBox";
import LoadingBox from "../../util/LoadingBox";
import { closeLoadingBox } from "../../util/LoadingBox";
import BillingAddressesList from "./BillingAddressesList";
import BillingAddressForm from "./BillingAddressForm";
import { useTranslation } from "react-i18next";
import {
  BILLING_ADDRESS_OF_USER_ROUTE,
  BILLING_ADDRESS_ROUTE,
} from "../../map/gpx/Resources";
import { apiUrl } from "../../../config";

const BillingAddress = ({
  userData,
  setInvoiceBA,
  invoiceBA,
  billingAddresses,
  setBillingAddresses,
}) => {
  const { t } = useTranslation();
  const [firstAndLastName, setFirstAndLastName] = useState("");
  const [country, setCountry] = useState("CountrySelection");
  const [address, setAddress] = useState("");
  const [additionalAddress, setAdditionalAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [corporateName, setCorporateName] = useState("");
  const [siret, setSiret] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [billingAddressesUpdated, setBillingAddressesUpdated] = useState(false);

  /**
   * Permet d'instancier une boîte de dialogue selon la situation.
   * @param {string} title
   * @param {string} text
   * @param {string} icon
   */

  const resetForm = () => {
    setFirstAndLastName("");
    setCountry("CountrySelection");
    setAddress("");
    setAdditionalAddress("");
    setCity("");
    setZipCode("");
    setCorporateName("");
    setSiret("");
    setIsProfessional(false);
    document.getElementById("checkBoxStatut").checked = false;
  };

  const CheckCountrySelection = () => {
    DialogBox({
      title: "Pays",
      text: "Veuillez sélectionner un pays",
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  /**
   * Permet d'enregistrer l'adresse de facturation de l'utilisateur
   * @param {Event} e
   *
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (country === "CountrySelection") {
      CheckCountrySelection();
      return;
    }

    axios
      .post(apiUrl + BILLING_ADDRESS_ROUTE, {
        corporateName: corporateName,
        siret: siret,
        firstAndLastName: firstAndLastName,
        country: country,
        address: address,
        additionalAddress: additionalAddress,
        city: city,
        zipCode: zipCode,
        user: userData._id,
      })
      .then((res) => {
        console.log(res);
        resetForm();
        DialogBox({
          title: t("billingAddress"),
          text: t("saveAddress"),
          icon: "success",
          confirmButtonText: "OK",
        });

        setBillingAddressesUpdated((prevState) => !prevState);
      })
      .catch((err) => {
        DialogBox({
          title: t("billingAddress"),
          text: t("saveAddressError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        console.log(err);
      });
  };

  /**
   * Permet de récupérer l'adresse de facturation de l'utilisateur
   */
  const fetchBillingAddresses = async () => {
    // Assuming LoadingBox is a function that shows a loading dialog
    LoadingBox({
      title: t("billingAddress"),
      text: t("pleaseWait"),
      icon: "info",
    });

    try {
      const res = await axios.get(
        apiUrl + BILLING_ADDRESS_OF_USER_ROUTE + userData._id
      );
      closeLoadingBox();
      setBillingAddresses(res.data);

      return res;
    } catch (err) {
      closeLoadingBox();
      if (!err.response || err.response.status !== 404) {
        DialogBox({
          title: t("billingAddress"),
          text: t("loadingAddressError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchBillingAddresses()
      .then((res) => {
        setBillingAddresses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [billingAddressesUpdated]);

  return (
    <div
      className={`row mt-4 mx-3 ${
        billingAddresses.length === 0 ? "justify-content-center" : ""
      }`}
    >
      <BillingAddressForm
        handleSubmit={handleSubmit}
        userData={userData}
        setIsProfessional={setIsProfessional}
        isProfessional={isProfessional}
        corporateName={corporateName}
        setCorporateName={setCorporateName}
        siret={siret}
        setSiret={setSiret}
        firstAndLastName={firstAndLastName}
        setFirstAndLastName={setFirstAndLastName}
        country={country}
        setCountry={setCountry}
        address={address}
        setAddress={setAddress}
        additionalAddress={additionalAddress}
        setAdditionalAddress={setAdditionalAddress}
        city={city}
        setCity={setCity}
        zipCode={zipCode}
        setZipCode={setZipCode}
      />

      {billingAddresses.length > 0 && (
        <div className="col-md-6 overflow-auto" style={{ maxHeight: "580px" }}>
          <BillingAddressesList
            billingAddresses={billingAddresses}
            setBillingAddresses={setBillingAddresses}
            userData={userData}
            setInvoiceBA={setInvoiceBA}
            invoiceBA={invoiceBA}
          />
        </div>
      )}
    </div>
  );
};

export default BillingAddress;
