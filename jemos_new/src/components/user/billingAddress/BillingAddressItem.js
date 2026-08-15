import React from "react";
import HTMLCountryOptions from "../../util/HTMLCountryOptions";
import { useState } from "react";
import { customToastNotify } from "../../util/Toast";
import { useTranslation } from "react-i18next";

const BillingAddressItem = ({
  billingAddresses,
  handleDelete,
  handleUpdate,
  isModified,
  setIsModified,
  handleCancel,
  editingValues,
  setEditingValues,
  userData,
  handleSetInvoiceBA,
  selectedBillingAddress,
}) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState(null);

  const handleChanges = (id, newValues) => {
    setEditingValues({
      ...editingValues,
      [id]: newValues,
    });
  };

  return billingAddresses.map((address, index) => (
    <div>
      <div key={address._id}>
        <div
          className={`card mb-4 shadow ${
            selectedBillingAddress === address._id
              ? "border border-primary border-3"
              : ""
          }`}
        >
          <div className="card-header fw-bolder">
            {t("billingAddress")} {index + 1}
          </div>
          <div className="card-body ">
            {isModified && editingId === address._id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(address._id, editingValues[address._id]);
                  setIsModified(false);
                  setEditingId(null);
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <input
                    className="form-control"
                    placeholder={t("first&lastName")}
                    type="text"
                    value={
                      editingValues[address._id]?.firstAndLastName !== undefined
                        ? editingValues[address._id]?.firstAndLastName
                        : address.firstAndLastName
                    }
                    required
                    onChange={(e) =>
                      handleChanges(address._id, {
                        ...editingValues[address._id],
                        firstAndLastName: e.target.value,
                      })
                    }
                  />
                </div>
                {address.corporateName && (
                  <div className="d-flex align-items-center mb-3">
                    <input
                      className="form-control"
                      placeholder={t("companyName")}
                      type="text"
                      value={
                        editingValues[address._id]?.corporateName !== undefined
                          ? editingValues[address._id]?.corporateName
                          : address.corporateName
                      }
                      required
                      onChange={(e) =>
                        handleChanges(address._id, {
                          ...editingValues[address._id],
                          corporateName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                {address.siret && (
                  <div className="d-flex align-items-center mb-3">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={"SIRET"}
                      value={
                        editingValues[address._id].siret !== undefined
                          ? editingValues[address._id].siret
                          : address.siret
                      }
                      required
                      onChange={(e) =>
                        handleChanges(address._id, {
                          ...editingValues[address._id],
                          siret: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div className="d-flex align-items-center mb-3">
                  <input
                    className="form-control"
                    type="text"
                    placeholder={t("address")}
                    value={
                      editingValues[address._id]?.address !== undefined
                        ? editingValues[address._id]?.address
                        : address.address
                    }
                    required
                    onChange={(e) =>
                      handleChanges(address._id, {
                        ...editingValues[address._id],
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                {address.additionalAddress && (
                  <div className="d-flex align-items-center mb-3">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={t("addressComplement")}
                      value={
                        editingValues[address._id]?.additionalAddress !==
                        undefined
                          ? editingValues[address._id]?.additionalAddress
                          : address.additionalAddress
                      }
                      required
                      onChange={(e) =>
                        handleChanges(address._id, {
                          ...editingValues[address._id],
                          additionalAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                <div className="d-flex align-items-center mb-3">
                  <input
                    className="form-control"
                    type="text"
                    minLength="5"
                    maxLength="5"
                    placeholder={t("zipCode")}
                    value={
                      editingValues[address._id]?.zipCode !== undefined
                        ? editingValues[address._id]?.zipCode
                        : address.zipCode
                    }
                    required
                    onChange={(e) =>
                      handleChanges(address._id, {
                        ...editingValues[address._id],
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="d-flex align-items-center mb-3">
                  <input
                    className="form-control"
                    type="text"
                    placeholder={t("city")}
                    value={
                      editingValues[address._id]?.city !== undefined
                        ? editingValues[address._id]?.city
                        : address.city
                    }
                    required
                    onChange={(e) =>
                      handleChanges(address._id, {
                        ...editingValues[address._id],
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="d-flex align-items-center mb-3">
                  <select
                    id="country"
                    name="country"
                    className="form-control"
                    value={
                      editingValues[address._id]?.country || address.country
                    }
                    aria-label="Pays"
                    onChange={(e) =>
                      handleChanges(address._id, {
                        ...editingValues[address._id],
                        country: e.target.value,
                      })
                    }
                  >
                    <HTMLCountryOptions />
                  </select>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none me-1"
                    onClick={() => {
                      setIsModified(!isModified);
                      if (isModified) {
                        handleCancel(address._id);
                      } else {
                        setEditingId(address._id);
                      }
                    }}
                    aria-label="Cancel-button"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-link text-decoration-none me-1"
                    aria-label="Save-button"
                  >
                    {t("accept")}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="fw-semibold">
                  {editingValues[address._id]?.firstAndLastName ||
                  editingValues[address._id]?.firstAndLastName === ""
                    ? editingValues[address._id]?.firstAndLastName
                    : address.firstAndLastName}
                </p>
                {address.corporateName && (
                  <p className="fw-semibold">
                    {editingValues[address._id]?.corporateName ||
                      address.corporateName}
                  </p>
                )}
                {address.siret && (
                  <p className="fw-semibold">
                    {editingValues[address._id]?.siret || address.siret}
                  </p>
                )}
                <p className="fw-semibold">
                  {editingValues[address._id]?.address || address.address}
                </p>
                {address.additionalAddress && (
                  <p className="fw-semibold">
                    {editingValues[address._id]?.additionalAddress ||
                      address.additionalAddress}
                  </p>
                )}
                <p className="fw-semibold">
                  {editingValues[address._id]?.city || address.city},{" "}
                  {editingValues[address._id]?.zipCode || address.zipCode}
                </p>
                <p className="fw-semibold">
                  {editingValues[address._id]?.country || address.country}
                </p>
              </>
            )}
            <div className="d-flex justify-content-between align-items-center">
              {!isModified || editingId !== address._id ? (
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    name="billingAddress"
                    value={address._id}
                    checked={selectedBillingAddress === address._id}
                    onClick={() => {
                      if (selectedBillingAddress === address._id) {
                        customToastNotify("info", t("addressAlreadySelected"));
                      } else {
                        handleSetInvoiceBA(userData._id, address._id);
                        customToastNotify("success", t("addressUpdate"));
                      }
                    }}
                  />
                  <label
                    htmlFor="billingAddress"
                    className="ms-2 mb-0"
                    aria-label="Use-button"
                  >
                    {t("useAddress")}
                  </label>
                </div>
              ) : null}

              <div className="d-flex align-items-center">
                {!isModified || editingId !== address._id ? (
                  <>
                    <button
                      className="btn btn-link text-decoration-none me-1"
                      onClick={() => {
                        setIsModified(true);
                        setEditingId(address._id);
                      }}
                      aria-label="Modif-button"
                    >
                      {t("edit")}
                    </button>

                    <button
                      className="btn btn-link text-decoration-none link-danger"
                      onClick={() => {
                        handleDelete(address._id);
                      }}
                      aria-label="Delete-button"
                    >
                      {t("delete")}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default BillingAddressItem;
