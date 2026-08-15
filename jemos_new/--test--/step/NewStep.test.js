import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { NewStep } from "../../src/components/map/customNavigation/NewStep"; // Ajustez le chemin si nécessaire

describe("NewStep Component", () => {
  const mockProps = {
    show: true,
    onHide: jest.fn(),
    onSave: jest.fn(),
    options: ["Option 1", "Option 2", "Option 3"],
  };

  // Vérifie que le composant se rend correctement

  it("renders correctly", () => {
    render(<NewStep {...mockProps} />);

    expect(screen.getByText("Nouvelle étape")).toBeInTheDocument();
    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("Type de manoeuvre")).toBeInTheDocument();
    expect(screen.getByText("Coordonnées")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Sauvegarder")).toBeInTheDocument();
  });

  // Vérifie que onHide est appelé lorsque le bouton Annuler est cliqué

  it("calls onHide when Annuler button is clicked", () => {
    render(<NewStep {...mockProps} />);

    fireEvent.click(screen.getByText("Annuler"));
    expect(mockProps.onHide).toHaveBeenCalled();
  });

  // Vérifie que la valeur de distance est mise à jour lorsque l'entrée change

  it("updates distance value when input changes", () => {
    render(<NewStep {...mockProps} />);

    const distanceInput = screen.getByPlaceholderText("Distance");
    fireEvent.change(distanceInput, { target: { value: "100" } });
    expect(distanceInput.value).toBe("100");
  });

  // Vérifie que les valeurs de latitude et longitude sont mises à jour lorsque les entrées changent

  it("updates latitude and longitude values when inputs change", () => {
    render(<NewStep {...mockProps} />);

    const latitudeInput = screen.getByPlaceholderText("Latitude");
    const longitudeInput = screen.getByPlaceholderText("Longitude");

    fireEvent.change(latitudeInput, { target: { value: "48.8566" } });
    fireEvent.change(longitudeInput, { target: { value: "2.3522" } });

    expect(latitudeInput.value).toBe("48.8566");
    expect(longitudeInput.value).toBe("2.3522");
  });

  // Vérifie que onSave est appelé avec les valeurs correctes lorsque le bouton Sauvegarder est cliqué

  it("calls onSave with correct values when Sauvegarder button is clicked", () => {
    render(<NewStep {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText("Distance"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Latitude"), {
      target: { value: "48.8566" },
    });
    fireEvent.change(screen.getByPlaceholderText("Longitude"), {
      target: { value: "2.3522" },
    });
    fireEvent.click(screen.getByText("Sélectionner une manoeuvre"));
    fireEvent.click(screen.getByText("Option 1"));

    fireEvent.click(screen.getByText("Sauvegarder"));

    expect(mockProps.onSave).toHaveBeenCalledWith({
      distance: "100",
      maneuver: "Option 1",
      start_location: "48.8566,2.3522",
      lat: "48.8566",
      lng: "2.3522",
    });
  });
});
