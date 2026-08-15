import React, { useState, useEffect } from "react";
import MapWithMarker from "./map/MapWithMarker";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { PROJECT_ROUTE } from "./map/gpx/Resources";
import { apiUrl } from "../config";

export default function PaletteMaker({
  projectId,
  userData,
  userPack,
  setVisibleComponent,
}) {
  const { t } = useTranslation();
  const [projectDatas, setProjectDatas] = useState(null);

  useEffect(() => {
    const fetchProjectDatas = async () => {
      const reponse = await axios.get(apiUrl + PROJECT_ROUTE + projectId);
      setProjectDatas(reponse.data);
    };
    fetchProjectDatas();
  }, [projectId]);

  if (!projectDatas) {
    return <div>{t("loading")}</div>;
  }

  let titleOfProject = "";
  if (projectDatas) {
    titleOfProject = projectDatas.name;
  }

  return (
    <div className="container-fluid">
      <div
        className="row"
        style={{ textAlign: "center", backgroundColor: "#ecedf1" }}
      >
        {/* récuperer le titre du projet venant d'être créé */}
        <h1 className="titleProject">
          {" "}
          {t("title")}
          {titleOfProject}
        </h1>
      </div>
      <div className="row">
        <div className="col-md-12" style={{ overflow: "auto" }}>
          <MapWithMarker
            projectDatas={projectDatas}
            userData={userData}
            titleOfProject={titleOfProject}
            userPack={userPack}
            setVisibleComponent={setVisibleComponent}
          />
        </div>
      </div>
    </div>
  );
}
