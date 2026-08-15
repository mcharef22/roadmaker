import React from "react";
import HTMLCountryOptions from "../../util/HTMLCountryOptions";
import { useTranslation } from "react-i18next";

const BillingAddressForm = ({
  handleSubmit,
  setIsProfessional,
  isProfessional,
  corporateName,
  setCorporateName,
  siret,
  setSiret,
  firstAndLastName,
  setFirstAndLastName,
  address,
  setAddress,
  additionalAddress,
  setAdditionalAddress,
  city,
  setCity,
  zipCode,
  setZipCode,
  country,
  setCountry,
}) => {
  const { t } = useTranslation();
  return (
    <div className="col-md-6">
      <div className="card mb-4 mb-xl-0 shadow">
        <div className="card-header fw-bolder">{t("newAddress")}</div>

        <div className="card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="border-0"
          >
            <div className="mb-2">
              <input
                className="form-check-input"
                aria-label="professional"
                type="checkbox"
                value=""
                id="checkBoxStatut"
                onChange={(e) => {
                  setIsProfessional(e.target.checked);
                }}
              ></input>
              <label
                htmlFor="checkBoxStatut"
                className="form-check-label mx-2"
                aria-label="Statut"
              >
                {t("professional")}
              </label>
            </div>

            {isProfessional ? (
              <>
                <div className="mb-4">
                  <label className="form-label" htmlFor="corporateName">
                    {t("companyName")} :
                  </label>{" "}
                  <input
                    id="corporateName"
                    className="form-control"
                    aria-label="Raison sociale"
                    type="text"
                    value={corporateName}
                    required
                    placeholder={t("companyName")}
                    onChange={(e) => {
                      setCorporateName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="siret">
                    SIRET :
                  </label>{" "}
                  <input
                    id="siret"
                    className="form-control"
                    aria-label="SIRET"
                    type="text"
                    minLength="14"
                    value={siret}
                    placeholder="SIRET"
                    required
                    onChange={(e) => {
                      setSiret(e.target.value);
                    }}
                  />
                </div>
              </>
            ) : null}
            <div className="mb-4">
              <label className="form-label" htmlFor="firstAndLastName">
                {t("first&lastName")}
              </label>{" "}
              <input
                id="firstAndLastName"
                className="form-control"
                aria-label="firstAndLastName"
                type="text"
                placeholder={t("first&lastName")}
                value={firstAndLastName}
                required
                onChange={(e) => {
                  setFirstAndLastName(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <div className="mb-4">
                <label className="form-label" htmlFor="address">
                  {t("address")}
                </label>{" "}
                <input
                  id="address"
                  className="form-control"
                  aria-label="Adresse"
                  type="text"
                  value={address}
                  required
                  placeholder={t("address")}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
              <input
                id="additionalAddress"
                className="form-control mt-2"
                aria-label="Complément d'adresse"
                type="text"
                value={additionalAddress}
                placeholder={t("addressComplement")}
                onChange={(e) => {
                  setAdditionalAddress(e.target.value);
                }}
              />
            </div>
            <div className="mb-4 row">
              <div className="col-6">
                <label className="form-label" htmlFor="city">
                  {t("city")}
                </label>{" "}
                <input
                  id="city"
                  className="form-control"
                  aria-label="Ville"
                  type="text"
                  value={city}
                  placeholder={t("city")}
                  required
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="col-6">
                <label className="form-label" htmlFor="zipCode">
                  {t("zipCode")}
                </label>{" "}
                <input
                  id="zipCode"
                  className="form-control"
                  aria-label="Code Postal"
                  type="text"
                  value={zipCode}
                  minLength="5"
                  required
                  placeholder={t("zipCode")}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="country">
                {t("country")}
              </label>
              <select
                id="country"
                name="country"
                value={country}
                className="form-control"
                aria-label="Pays"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              >
                <HTMLCountryOptions />
              </select>
            </div>
            <div className="">
              <button
                type="submit"
                className="btn btn-success"
                aria-label="Enregistrer-informations-button"
              >
                {t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingAddressForm;
