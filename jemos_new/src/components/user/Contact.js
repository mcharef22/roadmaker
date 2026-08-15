import axios from "axios";
import React from "react";
import { useState } from "react";
import { apiUrl } from "../../config";
import LoadingBox from "../util/LoadingBox";
import DialogBox from "../util/DialogBox";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { MessSendConfirmationBody } from "../util/mailHTML/MessSendConfirmationBody";
import { NewMessBody } from "../util/mailHTML/NewMessBody";
import { useTranslation } from "react-i18next";


const UserContact = ({ userData }) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mainContent = `
    ${MailTemplateHeader(
      "Nouveau message de la part d'un utilisateur"
    )}${NewMessBody(userData, message, subject)}`;

  const confirmationMainContent = `	${MailTemplateHeader(
    "Confirmation de l'envoi de votre message"
  )}${MessSendConfirmationBody(userData, message)}`;

  /**
   *
   * @param {event} e
   * Permet d'envoyer un message à l'entreprise
   */
  const sendEmail = async (e) => {
    e.preventDefault();
    const htmlMessage = MailHTMLTemplate(mainContent);

    let dataSend = {
      email: userData.email,
      subject: "Nouveau message de la part d'un utilisateur",
      replyTo: userData.email,
      message: htmlMessage,
    };

    LoadingBox({
      text: t("pleaseWait"),
      icon: "info",
    });

    try {
      //Send the email to the company
      await axios.post(apiUrl + "/email", dataSend);

      let confirmationDataSend = {
        email: userData.email,
        subject: "Confirmation de l'envoi de votre message",
        message: MailHTMLTemplate(confirmationMainContent),
      };

      // Send the confirmation email to the user
      await axios.post(apiUrl + "/email/user", confirmationDataSend);

      DialogBox({
        text: t("confirmationMessage"),
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      DialogBox({
        text: t("errorMessage"),
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-ms-row flex-xs-column mt-4 justify-content-center">
      <div className="col-xl-5">
        <div className="card mb-4 mb-xl-0 shadow">
          <div className="card-header fw-bolder">{t("contactForm")}</div>
          <div className="card-body">
            <form onSubmit={sendEmail} className="border-0">
              <div className="mb-4">
                <div className="form-label">{t("subject")}</div>
                <input
                  className="form-control"
                  type="text"
                  aria-label="input-subject"
                  placeholder={t("subjectPlaceholder")}
                  required
                  onChange={(e) => setSubject(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <div className="form-label">{t("yourMessage")}</div>
                <textarea
                  className="form-control"
                  aria-label="input-message"
                  type="text"
                  placeholder={t("yourMessage")}
                  rows="4"
                  required
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="">
                <button className="btn btn-success" type="submit" title="send">
                  {t("send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContact;
