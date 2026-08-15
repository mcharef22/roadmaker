import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import DialogBoxWithConfirmation from "../util/DialogBoxWithConfirmation";
import LoadingBox from "../util/LoadingBox";
import { closeLoadingBox } from "../util/LoadingBox";
import DialogBox from "../util/DialogBox";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { MailBodyUnsubscribe } from "../util/mailHTML/MailBodyUnsubscribe";
import { customToastNotify } from "../util/Toast";
import { useTranslation } from "react-i18next";

const Subscription = ({ userData, setUserPack, addToCart, cart }) => {
  const [pack, setPack] = useState(userData.pack);

  const mainContentUnsubscribe = `${MailTemplateHeader(
    "Désabonnement de Premium"
  )}${MailBodyUnsubscribe(userData)}`;
  /**
   * Permet de se désabonner de Premium
   */

  const handleUnsubscribe = async () => {
    const htmlMessage = MailHTMLTemplate(mainContentUnsubscribe);

    let dataSend = {
      email: userData.email,
      subject: "Désabonnement de Premium",
      message: htmlMessage,
    };

    try {
      await axios.put(apiUrl + `/user/${userData._id}`, {
        pack: "Standard",
      });
      setPack("Standard");
      setUserPack("Standard");

      await axios.post(apiUrl + "/email/user", dataSend);

      DialogBox({
        title: t("unsubscribing"),
        text: t("unsubscribeText"),
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Permet de s'abonner à Premium.
   */

  useEffect(() => {
    const fetchUserData = async () => {
      LoadingBox({
        title: t("loading"),
        text: t("pleaseWait"),
        icon: "info",
      });

      try {
        const response = await axios.get(apiUrl + `/user/${userData._id}`);
        const user = response.data;
        setPack(user.pack);
        closeLoadingBox();
      } catch (error) {
        console.log(error);
        closeLoadingBox();
      }
    };

    fetchUserData();
  }, [userData.pack]);

  const { t } = useTranslation();

  return (
    <div className="d-flex flex-sm-row flex-xs-column mt-4 justify-content-center ">
      <div className="col-xl-5">
        <div className="card mb-4 mb-xl-0 shadow">
          <div className="card-header fw-bolder ">{t("mySubscriptions")}</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">{t("subscription")}</th>
                  <th scope="col">{t("status")}</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <>
                    <td>Premium</td>
                    <td>
                      {pack === "Standard" ? (
                        <i
                          className="bi bi-x-circle-fill text-danger text-center m-3 fs-5"
                          data-testid="status-icon"
                        ></i>
                      ) : (
                        <i
                          className="bi bi-check-circle-fill text-success text-center m-3 fs-5"
                          data-testid="status-icon"
                        ></i>
                      )}
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          id="dropdownMenuButton1"
                          className="btn btn-info text-white rounded-pill btn-sm py-1 px-3"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          title="Actions"
                          aria-label="Actions sur l'abonnement"
                        >
                          <i className="bi bi-three-dots"></i>
                        </button>
                        <ul
                          className="dropdown-menu p-2"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            {pack === "Premium" ? (
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  DialogBoxWithConfirmation({
                                    title: t("confirmation"),
                                    text: t("unsubscribeConfirmation"),
                                    icon: "warning",
                                    confirmButtonText: t("yes"),
                                    cancelButtonText: t("no"),
                                  }).then((result) => {
                                    if (result) handleUnsubscribe();
                                  });
                                }}
                                title="Unsubscribe"
                                aria-label="Unsubscribe"
                              >
                                {t("unsubscribing")}
                              </button>
                            ) : (
                              <button
                                className="dropdown-item"
                                type="button"
                                title="Subscribe"
                                aria-label="Subscribe"
                                onClick={() => {
                                  const product = {
                                    id: "premiumSub",
                                    name: t("premiumSub"),
                                    price: 0.5,
                                  };

                                  if (
                                    !cart.some((item) => item.id === product.id)
                                  ) {
                                    console.log(
                                      "jest : produit ajouté au panier"
                                    );
                                    addToCart(product);
                                    customToastNotify(
                                      "success",
                                      t("premiumSub") + t("addedCart")
                                    );
                                  } else {
                                    console.log("jest : produit existe Déjà");
                                    customToastNotify(
                                      "error",
                                      t("notTwice") + product.name + t("toCart")
                                    );
                                  }
                                }}
                              >
                                {t("addToCart")}
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    </td>
                  </>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
