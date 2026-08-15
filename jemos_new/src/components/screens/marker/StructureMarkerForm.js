import React from "react";
import CheckBoxAudio from "./CheckBoxAudio";

const StructureMarkerForm = ({ 
    markerCheckAudio,
    updateCheckAudio
}) => {
    return (

        <div className="m-1">
             <CheckBoxAudio
                markerCheckAudio={markerCheckAudio}
                updateCheckAudio={updateCheckAudio}
                />
        </div>
    );
};

export default StructureMarkerForm;


