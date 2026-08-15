import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../components/style/global.css";
import DropDownPersonnalSpace from "./DropDownPersonnalSpace";
import Cart from "./Cart";
import LanguageSelector from "../util/LanguageSelector";
import { useTranslation } from "react-i18next";
const Menu = ({
  setVisibleComponent,
  isAdmin,
  disconnectUser,
  setSelectedProject,
  backToHub,
  setSelectedProjects,
  setAvatar,
  avatar,
  cart,
  setCart,
  userData,
  billingAddresses,
}) => {
  const { t } = useTranslation();
  const IMG_GEAR = "/rm_imgs/gear.png";
  const IMG_MAP = "/rm_imgs/map.png";
  return (
    <div className="d-flex flex-xs-row flex-sm-row justify-content-around align-items-center  m-2 m gap-sm-4">
      {/* Bouton apparaissant uniquement si l'utilisateur est admin  => affichage de la liste des utilisateurs */}
      {isAdmin && (
        <button
          className="btn btn-custom-large shadow-none mb-2 fs-2 px-2 py-2 py-md-3 px-md-3"
          id="btnUsers"
          onClick={(e) => {
            setVisibleComponent("Users");
          }}
          title={t("userList")}
          aria-label="Liste des utilisateurs"
        >
          <img src={IMG_GEAR} alt="Liste des utilisateurs" />
        </button>
      )}

      <Cart
        cart={cart}
        setCart={setCart}
        setSelectedProject={setSelectedProject}
        setSelectedProjects={setSelectedProjects}
        setVisibleComponent={setVisibleComponent}
        userData={userData}
        billingAddresses={billingAddresses}
      />

      {/* Bouton Carte => affichage des projets */}
      <button
        className="btn btn-custom-large shadow-none mb-2 fs-2 px-2 py-2 py-md-3 px-md-3"
        id="btnUsers"
        onClick={() => {
          backToHub();
        }}
        title={t("projectList")}
        aria-label="Choix du projet"
      >
        <img src={IMG_MAP} alt="Choix du projet" />
      </button>

      <DropDownPersonnalSpace
        data-testid="mon-espace-button"
        aria-label="Mon espace"
        setAvatar={setAvatar}
        avatar={avatar}
        disconnectUser={disconnectUser}
        setVisibleComponent={setVisibleComponent}
      />

      <LanguageSelector />
    </div>
  );
};

export default Menu;
