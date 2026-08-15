import React from "react";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../ThemeContext";
import { customToastNotify } from "./Toast";

function ThemeSelector() {
    const { setTheme } = useContext(ThemeContext);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
        localStorage.setItem('theme', e.target.value);
        customToastNotify("success", "Thème changé avec succès");

    };

    return (

        <select value={localStorage.getItem("theme")} onChange={handleThemeChange} className={"form-select text-center"}>
            <option value="bg-white">Clair</option>
            <option value="bgRoadMaker">RoadMaker</option>
        </select>

    );

}

export default ThemeSelector;
