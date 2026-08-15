import React, { useState } from "react";

function StepBoxTouristicMarker({
  selectedMarker,
  marker,
  handleMarkerClick,
  setSelectedMarker,
  handleIconPIClick,
  showResources,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDetailsClick = (event, id) => {
    event.stopPropagation();
    handleIconPIClick(id);
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`d-flex flex-column p-1 pt-2 mt-1 ${
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
      <div className="d-flex align-items-center">
        {marker.type === "touristic" && (
          <div>
            <details
              onClick={(event) => {
                handleDetailsClick(event, marker.id);
              }}
              open={isOpen}
              aria-label="input-showRessources"
              className="details-openTouristic"
            >
              <summary className="triangleTouristicPoint marker-title marker-title">
                <img
                  src={
                    isOpen ? "/rm_imgs/flecheAfter.png" : "/rm_imgs/fleche.png"
                  }
                  alt="fleche"
                />
              </summary>
            </details>
          </div>
        )}
        <h5 className="text-dark fs-5 fw-bold mt-1 ms-1">
          {" "}
          <span dangerouslySetInnerHTML={{ __html: marker.title }} />
        </h5>
      </div>

      {isOpen &&
        marker.type === "touristic" &&
        Array.isArray(marker.resourceArray) && (
          <div className="">
            {" "}
            {marker.resourceArray.map((resource) => (
              <li className=" list-unstyled ms-5 fs-5 fw-bold" key={resource}>
                {resource}
              </li>
            ))}
          </div>
        )}
    </div>
  );
}

export default StepBoxTouristicMarker;
