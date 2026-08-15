import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsFilterOptions from "../../src/components/home/ProjectsFilterOptions";
import i18n from "i18next";
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/map/gpx/Resources", () => ({
  parcoursTypes: {
    car: "Voiture",
    cycle: "Velo",
    pedestrian: "Rando",
    fast_forward: "Retour_rapide",
  },
}));

describe("ProjectsFilterOptions", () => {
  test("renders filter options correctly", () => {
    const setFilterType = jest.fn();
    const setSortOrder = jest.fn();
    const setSearchTerm = jest.fn();
    const setFilterTag = jest.fn();

    const parcoursTypes = ["Type1", "Type2", "Type3"];
    const projects = [
      { tag: "Tag1", user: "User1" },
      { tag: "Tag2", user: "User2" },
      { tag: "Tag1", user: "User1" },
    ];
    const userData = { _id: "User1" };

    render(
      <ProjectsFilterOptions
        filterType=""
        setFilterType={setFilterType}
        sortOrder="asc"
        setSortOrder={setSortOrder}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        parcoursTypes={parcoursTypes}
        filterTag=""
        setFilterTag={setFilterTag}
        projects={projects}
        userData={userData}
      />
    );

    const filterTypeSelect = screen.getByLabelText("filter type");
    const sortOrderSelect = screen.getByLabelText("sort order");
    const searchTermInput = screen.getByPlaceholderText(i18n.t("research"));

    expect(filterTypeSelect).toHaveValue("");
    expect(sortOrderSelect).toHaveValue("asc");
    expect(searchTermInput).toHaveValue("");
  });

  test("triggers the filter and search functions", () => {
    const setFilterType = jest.fn();
    const setSortOrder = jest.fn();
    const setSearchTerm = jest.fn();
    const setFilterTag = jest.fn();

    const parcoursTypes = ["Type1", "Type2", "Type3"];
    const projects = [
      { tag: "Tag1", user: "User1" },
      { tag: "Tag2", user: "User2" },
      { tag: "Tag1", user: "User1" },
    ];
    const userData = { _id: "User1" };

    render(
      <ProjectsFilterOptions
        filterType=""
        setFilterType={setFilterType}
        sortOrder="asc"
        setSortOrder={setSortOrder}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        parcoursTypes={parcoursTypes}
        filterTag=""
        setFilterTag={setFilterTag}
        projects={projects}
        userData={userData}
      />
    );

    const filterTypeSelect = screen.getByLabelText("filter type");
    const sortOrderSelect = screen.getByLabelText("sort order");
    const searchTermInput = screen.getByPlaceholderText(i18n.t("research"));

    fireEvent.change(filterTypeSelect, { target: { value: "" } });
    fireEvent.change(sortOrderSelect, { target: { value: "desc" } });
    fireEvent.change(searchTermInput, { target: { value: "SearchTerm" } });

    expect(setFilterType).toHaveBeenCalledWith("");
    expect(setSortOrder).toHaveBeenCalledWith("desc");
    expect(setSearchTerm).toHaveBeenCalledWith("SearchTerm");
  });
});
