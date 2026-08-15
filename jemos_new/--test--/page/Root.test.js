import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Root from "../../src/components/login/Root";

jest.mock("../../src/components/home/Home", () => {
  return () => <div data-testid="hub-component">composant</div>;
});
jest.mock("../../src/components/login/Connexion", () => {
  return () => <div data-testid="connexion-component">composant</div>;
});
jest.mock("../../src/components/login/Inscription", () => {
  return () => <div data-testid="inscription-component">composant </div>;
});

describe("Root", () => {
  it("connexion button is clicked", () => {
    render(<Root />);

    const connexionButton = screen.getByLabelText("btn-connexion");
    fireEvent.click(connexionButton);

    expect(screen.getByTestId("connexion-component")).toBeInTheDocument();
  });

  it("inscription button is clicked", () => {
    render(<Root />);

    const inscriptionButton = screen.getByLabelText("btn-inscription");
    fireEvent.click(inscriptionButton);

    expect(screen.getByTestId("inscription-component")).toBeInTheDocument();
  });

  it("Accueil button clickedwith user data", () => {
    const userData = {};
    sessionStorage.setItem("userData", JSON.stringify(userData));

    render(<Root />);

    const accueilButton = screen.getByLabelText("btn-connexion");
    fireEvent.click(accueilButton);

    expect(screen.getByTestId("hub-component")).toBeInTheDocument();
  });
});
