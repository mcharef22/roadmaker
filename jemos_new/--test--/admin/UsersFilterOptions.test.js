import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UsersFilterOptions from "../../src/components/home/admin/UsersFilterOptions";

describe("UsersFilterOptions", () => {
  test("renders filter options correctly", () => {
    const setSearchTerm = jest.fn();
    const setIsAdminFilter = jest.fn();
    const setIsConfirmedFilter = jest.fn();
    const setSortOrder = jest.fn();

    render(
      <UsersFilterOptions
        searchTerm="John"
        setSearchTerm={setSearchTerm}
        isAdminFilter=""
        setIsAdminFilter={setIsAdminFilter}
        isConfirmedFilter="true"
        setIsConfirmedFilter={setIsConfirmedFilter}
        sortOrder="asc"
        setSortOrder={setSortOrder}
      />
    );

    const roleFilter = screen.getByLabelText(/rôle/i);
    const statusFilter = screen.getByLabelText(/status/i);
    const sortOrderFilter = screen.getByLabelText(/tri par date/i);
    const searchInput = screen.getByLabelText("Rechercher");

    expect(roleFilter).toHaveValue("");
    expect(statusFilter).toHaveValue("true");
    expect(sortOrderFilter).toHaveValue("asc");
    expect(searchInput).toHaveValue("John");
  });

  test("triggers the filter and search functions", () => {
    const setSearchTerm = jest.fn();
    const setIsAdminFilter = jest.fn();
    const setIsConfirmedFilter = jest.fn();
    const setSortOrder = jest.fn();

    render(
      <UsersFilterOptions
        searchTerm="John"
        setSearchTerm={setSearchTerm}
        isAdminFilter=""
        setIsAdminFilter={setIsAdminFilter}
        isConfirmedFilter="true"
        setIsConfirmedFilter={setIsConfirmedFilter}
        sortOrder="asc"
        setSortOrder={setSortOrder}
      />
    );

    const roleFilter = screen.getByLabelText(/rôle/i);
    const statusFilter = screen.getByLabelText(/status/i);
    const sortOrderFilter = screen.getByLabelText(/tri par date/i);
    const searchInput = screen.getByLabelText("Rechercher");

    fireEvent.change(roleFilter, { target: { value: "true" } });
    fireEvent.change(statusFilter, { target: { value: "false" } });
    fireEvent.change(sortOrderFilter, { target: { value: "desc" } });
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(setIsAdminFilter).toHaveBeenCalledWith("true");
    expect(setIsConfirmedFilter).toHaveBeenCalledWith("false");
    expect(setSortOrder).toHaveBeenCalledWith("desc");
    expect(setSearchTerm).toHaveBeenCalledWith("Alice");
  });
});
