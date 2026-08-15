import React from "react";
import { useTranslation } from "react-i18next";

const UsersFilterOptions = ({
  searchTerm,
  setSearchTerm,
  isAdminFilter,
  setIsAdminFilter,
  isConfirmedFilter,
  setIsConfirmedFilter,
  sortOrder,
  setSortOrder,
}) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-end my-3">
      <select
        className="form-select me-3 w-30"
        value={isAdminFilter}
        onChange={(e) => setIsAdminFilter(e.target.value)}
        aria-label="rôle"
      >
        <option value="">{t("role")}</option>
        <option value="true">{t("administrator")}</option>
        <option value="false">{t("noadmin")}</option>
      </select>

      <select
        className="form-select me-3 w-30"
        value={isConfirmedFilter}
        onChange={(e) => setIsConfirmedFilter(e.target.value)}
        aria-label="Status"
      >
        <option value="">{t("status")}</option>
        <option value="true">{t("confirmed")}</option>
        <option value="false">{t("notConfirmed")}</option>
      </select>

      <select
        className="form-select me-3 w-30"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        aria-label="Tri par date"
      >
        <option value="asc">{t("ascendingDateSort")}</option>
        <option value="desc">{t("descendingDateSort")}</option>
      </select>

      <input
        type="text"
        className="form-control w-30"
        placeholder={t("research")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Rechercher"
      />
    </div>
  );
};

export default UsersFilterOptions;
