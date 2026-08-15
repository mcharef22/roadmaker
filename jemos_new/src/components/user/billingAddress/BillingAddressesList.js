import React, { useEffect, useState } from "react";
import { UpdateUserInfo } from "../../util/mailHTML/UpdateUserInfo";
import { MailTemplateHeader } from "../../util/mailHTML/MailTemplateHeader";
import BillingAddressItem from "./BillingAddressItem";
import DialogBox from "../../util/DialogBox";
import { MailHTMLTemplate } from "../../util/mailHTML/MailHTMLTemplate";
import axios from "axios";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import { customToastNotify } from "../../util/Toast";
import { useTranslation } from "react-i18next";
import {
  BILLING_ADDRESS_OF_USER_ROUTE,
  BILLING_ADDRESS_ROUTE,
  EMAIL_OF_USER_ROUTE,
  INVOICE_BILLING_ADDRESS_ROUTE,
  USER_ROUTE,
} from "../../map/gpx/Resources";
import { apiUrl } from "../../../config";

const BillingAddressesList = ({
  billingAddresses,
  userData,
  setBillingAddresses,
  invoiceBA,
  setInvoiceBA,
}) => {
  const { t } = useTranslation();
  const [isModified, setIsModified] = useState(false);

  const [updatedBillingAddress, setUpdatedBillingAddress] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  useEffect(() => {
    const defaultAddress =
      billingAddresses.length === 1
        ? handleSetInvoiceBA(userData._id, billingAddresses[0]._id)
        : billingAddresses.find((address) => address.selected === true);

    if (defaultAddress) {
      setSelectedBillingAddress(defaultAddress._id);
      setInvoiceBA(defaultAddress);
    }
  }, [billingAddresses]);

  const updateMainContent = `${MailTemplateHeader(
    "Modification de votre adresse de facturation"
  )}${UpdateUserInfo(userData, "votre adresse de facturation")}`;

  /**
   * @param {String} id
   * @param {Object} newValues
   * Permet de mettre à jour l'adresse de facturation de l'utilisateur
   */

  const handleUpdate = async (id, newValues) => {
    const htmlMessage = MailHTMLTemplate(updateMainContent);

    try {
      await axios.put(apiUrl + BILLING_ADDRESS_ROUTE + "/" + id, newValues);
      setUpdatedBillingAddress(newValues);

      DialogBox({
        title: t("billingAddress"),
        text: t("addressModif"),
        icon: "success",
        confirmButtonText: "OK",
      });

      await axios.post(apiUrl + EMAIL_OF_USER_ROUTE, {
        email: userData.email,
        subject: "Modification de votre adresse de facturation",
        message: htmlMessage,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   *
   * @param {String} id
   * Permet d'annuler la modification d'une adresse de facturation
   */
  const handleCancel = async (id) => {
    try {
      setEditingValues({
        ...editingValues,
        [id]: updatedBillingAddress,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   *
   * @param {String} id
   * Permet de lancer la boîte de dialogue de confirmation de suppression d'une adresse de facturation
   */
  const handleDelete = async (id) => {
    DialogBoxWithConfirmation({
      title: t("deleteAddress"),
      text: t("deleteAddressMessage"),
      icon: "warning",
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    })
      .then((result) => {
        if (result) {
          deleteBillingAddress(id);
          customToastNotify("success", t("deleteSuccess"));
        }
      })
      .catch((err) => {
        console.error(err);
        customToastNotify("error", t("deleteAddressError"));
      });
  };

  /**
   *
   * @param {String} addressId
   * Permet de supprimer une adresse de facturation dans la collection billingAddresses
   * et de mettre à jour l'utilisateur en supprimant l'adresse de facturation supprimée
   */
  const deleteBillingAddress = async (addressId) => {
    try {
      const response = await axios.get(
        apiUrl + BILLING_ADDRESS_OF_USER_ROUTE + userData._id
      );
      const billingAddresses = response.data;

      await axios.delete(apiUrl + BILLING_ADDRESS_ROUTE + "/" + addressId);
      const newBillingAddresses = billingAddresses.filter(
        (billingAddress) => billingAddress._id !== addressId
      );
      setBillingAddresses(newBillingAddresses);
      await updateUserData(newBillingAddresses);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUserData = async (newBillingAddresses) => {
    try {
      await axios.put(apiUrl + USER_ROUTE + userData._id, {
        billingAddress: newBillingAddresses,
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   *
   * @param {String} userId
   * @param {String} addressId
   * Permet de définir l'adresse de facturation de l'utilisateur qui sera utilisée pour les factures
   */
  const handleSetInvoiceBA = async (userId, addressId) => {
    try {
      const response = await axios.put(
        `${apiUrl}${INVOICE_BILLING_ADDRESS_ROUTE}${userId}/${addressId}`
      );
      setInvoiceBA(response.data);
      setSelectedBillingAddress(addressId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <BillingAddressItem
        billingAddresses={billingAddresses}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        isModified={isModified}
        setIsModified={setIsModified}
        handleCancel={handleCancel}
        editingValues={editingValues}
        setEditingValues={setEditingValues}
        invoiceBA={invoiceBA}
        setInvoiceBA={setInvoiceBA}
        userData={userData}
        handleSetInvoiceBA={handleSetInvoiceBA}
        selectedBillingAddress={selectedBillingAddress}
      />
    </div>
  );
};

export default BillingAddressesList;
