import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeContext } from "../../../src/ThemeContext";
import ThemeSelector from "../../../src/components/util/ThemeSelector";


describe("ThemeSelector", () => {

    test("should render with default theme", () => {
        const setTheme = jest.fn();
        render(
            <ThemeContext.Provider value={{ setTheme }}>
                <ThemeSelector />
            </ThemeContext.Provider>
        );

        const select = screen.getByRole("combobox");
        expect(select.value).toBe("bg-white");
    });

    test("should change theme on select change", () => {
        const setTheme = jest.fn();
        render(
            <ThemeContext.Provider value={{ setTheme }}>
                <ThemeSelector />
            </ThemeContext.Provider>
        );

        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "bgRoadMaker" } });

        expect(setTheme).toHaveBeenCalledWith("bgRoadMaker");
        expect(localStorage.getItem("theme")).toBe("bgRoadMaker");
    });

    test("should use stored theme on mount", () => {
        localStorage.setItem("theme", "bgRoadMaker");
        const setTheme = jest.fn();
        render(
            <ThemeContext.Provider value={{ setTheme }}>
                <ThemeSelector />
            </ThemeContext.Provider>
        );

        expect(setTheme).toHaveBeenCalledWith("bgRoadMaker");
    });
});