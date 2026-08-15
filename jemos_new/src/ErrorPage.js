import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="AppBgError d-flex justify-content-center align-items-center">
      <div className="container text-center">
        <div className=" bg-light p-3 p-sm-5 rounded-5 shadow-lg d-flex flex-column align-items-center col-md-8 m-auto">
          <div className="d-flex align-items-center justify-content-center">
            <h1 className="title404 fw-bold">4</h1>
            <img
              src="/rm_imgs/logo_connexion.png"
              alt="Logo"
              className="logo404 mx-2 mt-3"
            />
            <h1 className="title404 fw-bold">4</h1>
          </div>
          <div className="mt-3">
            <h3 className="subTitle404 fw-semibold">{t("error404Line")}</h3>
            <button
              className="btn404 mt-3 fw-bolder "
              onClick={() => {
                navigate("/");
              }}
            >
              {t("backToTheRightPlace")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
