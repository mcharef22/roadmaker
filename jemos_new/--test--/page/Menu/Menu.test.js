import React from "react";
import Menu from "../../../src/components/home/Menu";
import { render, screen, fireEvent } from "@testing-library/react";
import i18n from "i18next";
import DropDownPersonnalSpace from "../../../src/components/home/DropDownPersonnalSpace";

const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../../src/components/user/UserProfile", () => {});
jest.mock("../../../src/components/map/gpx/Resources", () => ({}));

jest.mock("../../../src/components/home/Cart", () => {
  return jest.fn(() => <div>Cart</div>);
});

jest.mock("../../../src/components/util/LanguageSelector", () => {
  return jest.fn(() => <div>LanguageSelector</div>);
});

jest.mock("../../../src/components/util/ThemeSelector", () => {
  return jest.fn(() => <div>ThemeSelector</div>);
});

jest.mock("../../../src/components/home/DropDownPersonnalSpace", () => {
  return jest.fn(() => (
    <div aria-label="Mon espace">DropDownPersonnalSpace</div>
  ));
});

describe("Menu", () => {
  const props = {
    setVisibleComponent: jest.fn(),
    isAdmin: true,
    disconnectUser: jest.fn(),
    setSelectedProject: jest.fn(),
    backToHub: jest.fn(),
    setSelectedProjects: jest.fn(),
    setAvatar: jest.fn(),
    avatar: "https://example.com/avatar.png",
    userData: {
      avatar: "https://example.com/avatar.png",
    },
    cart: [
      {
        name: "Abonnement x",
        price: 0.5,
      },
    ],
  };

  test("renders correctly when user is admin", () => {
    render(<Menu {...props} />);

    expect(screen.getByLabelText("Liste des utilisateurs")).toBeInTheDocument();
    expect(screen.getByLabelText("Choix du projet")).toBeInTheDocument();
    expect(screen.getByLabelText("Mon espace")).toBeInTheDocument();
  });

  test("renders correctly when user is not admin", () => {
    const nonAdminProps = { ...props, isAdmin: false };
    render(<Menu {...nonAdminProps} />);

    expect(
      screen.queryByLabelText("Liste des utilisateurs"),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Choix du projet")).toBeInTheDocument();
    expect(screen.getByText("DropDownPersonnalSpace")).toBeInTheDocument();
  });

  test("clicking on Liste des utilisateurs button calls setShowUsers", () => {
    render(<Menu {...props} />);

    const listeDesUtilisateursButton = screen.getByLabelText(
      "Liste des utilisateurs",
    );
    fireEvent.click(listeDesUtilisateursButton);
    expect(props.setVisibleComponent).toHaveBeenCalledWith("Users");
  });

  test("clicking on Choix du projet button calls backToHub", () => {
    render(<Menu {...props} />);

    const choixDuProjetButton = screen.getByLabelText("Choix du projet");
    fireEvent.click(choixDuProjetButton);

    expect(props.backToHub).toHaveBeenCalled();
  });
});
