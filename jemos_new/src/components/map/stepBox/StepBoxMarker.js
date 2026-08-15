import React from "react";
import { useTranslation } from "react-i18next";

function StepBoxMarker({
  selectedMarker,
  marker,
  handleMarkerClick,
  setSelectedMarker,
}) {
  const { t } = useTranslation();
  if (!marker) {
    return null;
  }

  return (
    <div
      className={`d-flex align-items-center p-1 pt-2 mt-1 ${
        selectedMarker === marker.id ? "markerSelected" : ""
      }`}
      key={marker.id}
      id={"marker-" + marker.id}
      onClick={() => {
        handleMarkerClick(marker.id);
        setSelectedMarker(marker.id);
      }}
      onMouseEnter={() => {
        const element = document.getElementById("marker-" + marker.id);
        element.style.cursor = "pointer";
        if (selectedMarker !== marker.id) {
          if (element) {
            element.classList.add("bg-light");
          }
        }
      }}
      onMouseLeave={() => {
        const element = document.getElementById("marker-" + marker.id);
        if (element) {
          element.style.cursor = "default";
          element.classList.remove("bg-light");
        }
      }}
    >
      <h5 className="text-dark fw-bold ">
        <span dangerouslySetInnerHTML={{ __html: marker.title }} />
      </h5>
    </div>
  );
}

export default StepBoxMarker;
