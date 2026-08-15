import React from "react";
import { useTranslation } from "react-i18next";
import { parcoursTypes } from "../map/gpx/Resources";

const ProjectsFilterOptions = ({
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
  filterTag,
  setFilterTag,
  projects,
  userData,
}) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-end my-3">
      <select
        className="form-select me-3 w-30"
        value={filterType}
        aria-label="filter type"
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">{t("allTypes")}</option>
        {Object.values(parcoursTypes).map((type, index) => (
          <option value={type} key={`type-${index}`}>
            {type === parcoursTypes.car && t("voiture")}
            {type === parcoursTypes.cycle && t("velo")}
            {type === parcoursTypes.pedestrian && t("pedestrian")}
            {type === parcoursTypes.fast_forward && t("fastForward")}
          </option>
        ))}
      </select>
      <select
        className="form-select me-3 w-30"
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
      >
        <option value="">{t("allTracks")}</option>
        {projects
          .filter(
            (project, index, self) =>
              self.findIndex((p) => p.tag === project.tag) === index
          )
          .filter((project) => project.user === userData._id)
          .map((project, index) => (
            <option value={project.tag} key={`tag-${index}`}>
              {project.tag}
            </option>
          ))}
      </select>
      <select
        className="form-select me-3 w-30"
        value={filterTag}
        aria-label="filter tag"
        onChange={(e) => setFilterTag(e.target.value)}
        style={{ display: "none" }}
      >
        <option value="">{t("allTypes")}</option>
        {projects.map((project, index) => (
          <option value={project.tag} key={`tag-${index}`}>
            {project.tag}
          </option>
        ))}
      </select>

      <select
        className="form-select me-3 w-30"
        value={sortOrder}
        aria-label="sort order"
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">{t("creationDate")} 🔼</option>
        <option value="desc">{t("creationDate")} 🔽</option>
      </select>

      <input
        type="text"
        className="form-control w-30"
        placeholder={t("research")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ProjectsFilterOptions;
