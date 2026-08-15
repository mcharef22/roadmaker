import React from "react";
import { render, screen } from "@testing-library/react";
import CoordinatesAlert from "../../src/components/map/CoordinatesAlert";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


test("render CoordinatesAlert when copiedCoordinates is true", () => {
  const { getByText } = render(<CoordinatesAlert copiedCoordinates={true} />);
  const alertElement = screen.getByText(
    i18n.t("coordsPasted")
  );
  expect(alertElement).toBeInTheDocument();
});

test("do not render CoordinatesAlert when copiedCoordinates is false", () => {
  const { queryByText } = render(
    <CoordinatesAlert copiedCoordinates={false} />
  );
  const alertElement = screen.queryByText(
    i18n.t("coordsPasted")
  );
  expect(alertElement).toBeNull();
});
