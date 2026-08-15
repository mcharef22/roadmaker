import React, { useContext } from "react";
import "./../../components/style/global.css";
import axios from "axios";
import { useEffect, useState } from "react";
import ProjectForm from "../ProjectForm";
import PaletteMaker from "../PaletteMaker";
import { stripePublicKey } from "../../config";
import DialogBoxWithConfirmation from "../util/DialogBoxWithConfirmation";
import ProjectsList from "./ProjectsList";
import { markerTypes } from "../map/MapWithMarker";
import {
  ICON_INDEX_DELETED,
  POI_ROUTE,
  USER_ROUTE,
  POI_OF_PROJECT_ROUTE,
  PROJECT_ROUTE,
} from "../map/gpx/Resources";
import UsersList from "./admin/UsersList";
import UserProfile from "../user/UserProfile";
import { LoadingBox } from "../util/LoadingBox";
import { closeLoadingBox } from "../util/LoadingBox";
import BillingAddress from "../user//billingAddress/BillingAddress";
import Contact from "../user/Contact";
import Invoices from "../user/invoices/Invoices";
import Menu from "./Menu";
import Subscription from "../user/Subscription";
import CreditCards from "../payment/CreditCards";
import PaymentPage from "../payment/PaymentPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";
import { apiUrl } from "../../config";
const PUBLIC_KEY = stripePublicKey;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Home = ({ userData, setUserData }) => {
  const [iconIndexArray, setIconIndexArray] = useState(userData.iconIndexArray);
  const [projects, setProjects] = useState([]);
  const [createProject, setCreateProject] = useState(
    "btn btn-outline-primary mt-4"
  );
  const [deleteProjects, setDeleteProjects] = useState(
    "btn btn-outline-danger mt-4 ms-4"
  );
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectsEmpty, setIsProjectsEmpty] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const [editingProject, setEditingProject] = useState(null);
  const [projectsName, setProjectsName] = useState(null);
  const [modifiedName, setModifiedName] = useState("");
  const [modifiedTag, setModifiedTag] = useState("");
  const [afficheMessageErreur, setAfficheMessageErreur] = useState(false); //pour le meme nom
  const [afficheMessageErreurVide, setAfficheMessageErreurVide] =
    useState(false); //pour un nom vide
  const [afficheMessageErreurType, setAfficheMessageErreurType] =
    useState(false);
  const [userName, setUserName] = useState(userData.name);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [userPack, setUserPack] = useState(userData.pack);
  const [pack, setPack] = useState(userData.pack);
  const [visibleComponent, setVisibleComponent] = useState("Hub");
  const [invoiceBA, setInvoiceBA] = useState({});
  const [billingAddresses, setBillingAddresses] = useState([]);

  const savedCart = sessionStorage.getItem("cart");
  const initialCart = savedCart ? JSON.parse(savedCart) : [];
  const [cart, setCart] = useState(initialCart);
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    /**
     * Récupère les projets de l'utilisateur
     */
    async function fetchData() {
      try {
        LoadingBox({
          text: t("loadingCourses"),
          icon: "info",
        });
        const resProjects = await axios.get(apiUrl + PROJECT_ROUTE, {
          params: {
            user: userData._id,
          },
        });
        setProjects(resProjects.data);
        closeLoadingBox();
      } catch (error) {
        console.log(error);
      }
    }
    setIsAdmin(userData.admin);
    fetchData();
  }, [userData._id]);

  useEffect(() => {
    /**
     * Récupère les noms des projets de l'utilisateur,
     * se met à jour à chaque fois que la liste des projets est modifiée
     * @param {array} projects
     *
     */
    const userProjects = projects.filter((project) => {
      return project.user === userData._id;
    });
    // Extraire les noms des projets de l'utilisateur
    const projectsNames = userProjects.map((project) => project.name);
    setProjectsName(projectsNames);
    if (userProjects.length === 0) {
      setIsProjectsEmpty(true);
    } else {
      setIsProjectsEmpty(false);
    }
  }, [projects]);

  /**
   * Supprime l'icone du marker du iconIndexArray
   * @param {object} marker
   */
  const deleteFromIconIndexArray = (marker) => {
    if (marker.type === markerTypes.touristic) {
      // On contineu uniquement si le marker contient une icone
      if (marker.iconName && marker.iconName.length > 0) {
        // On vérifie que l'icone n'existe pas déjà dans la liste du User
        if (iconIndexArray.includes(marker.iconName)) {
          const iconNameIndex = iconIndexArray.indexOf(marker.iconName);
          if (iconNameIndex !== -1) {
            iconIndexArray[iconNameIndex] =
              ICON_INDEX_DELETED + marker.iconName;
          }
        }
      }
    }
  };

  /**
   * Supprime les markers associés au projet
   * @param {string} projectId
   * @async
   * @method
   * @throws {error} error
   */

  const deleteProjectMarkers = async (projectId) => {
    const projectMarkers = await axios.get(POI_OF_PROJECT_ROUTE + projectId);
    projectMarkers.data.forEach(async (marker) => {
      // Par sécurité, on ne supprime pas la valeur par défaut
      if (iconIndexArray.length > 1) deleteFromIconIndexArray(marker);
      await axios.delete(apiUrl + POI_ROUTE + marker._id);
      // sauvegarde des attributs du User
      try {
        const res = await axios.put(apiUrl + USER_ROUTE + userData._id, {
          iconIndexArray: iconIndexArray,
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  /**
   * Permet de lancer la suppression d'un projet
   * @param {string} id
   * @param {boolean} showConfirm
   */

  const handleDeleteProject = (id, showConfirm) => async (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (showConfirm) {
      const confirmDelete = await DialogBoxWithConfirmation({
        title: t("titleDialogBoxSupprCourses"),
        text: t("messageDialogBoxSupprCourse"),
        icon: "warning",
        cancelButtonText: t("no"),
        confirmButtonText: t("yes"),
      });

      /// Confirmer la suppression
      if (confirmDelete) {
        await deleteProject(id);
      }
    } else {
      await deleteProject(id);
    }
  };

  /**
   * Permet de lancer la suppression de plusieurs projets
   * @async
   * @method
   * @throws {error} error
   *
   *
   */
  const handleDeleteSelectedProjects = async () => {
    if (selectedProjects.length === 0) {
      return;
    }

    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("titleDialogBoxSupprMultipleCourses"),
      text: t("messageDialogBoxSupprMultipleCourses"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });

    if (!confirmDelete) {
      return;
    }

    try {
      const deletionPromises = selectedProjects.map((projectId) =>
        handleDeleteProject(projectId, false)()
      );

      await Promise.all(deletionPromises);

      const updatedProjects = projects.filter(
        (project) =>
          !selectedProjects.includes(project._id) &&
          project.user === userData._id
      );

      setProjects(updatedProjects);
      setSelectedProjects([]);
      updateUserData(updatedProjects);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Permet de supprimer un projet
   * @param {string} id
   * @async
   * @method
   * @throws {error} error
   */
  const deleteProject = async (id) => {
    try {
      LoadingBox({
        text: t("deleteCourse"),
        icon: "info",
      });

      const response = await axios.get(apiUrl + PROJECT_ROUTE + id);
      const project = response.data;

      if (!project) {
        console.log("Le projet n'existe pas.");
        return;
      }

      const projectName = project.name;
      setProjectsName((prevNames) =>
        prevNames.filter((name) => name !== projectName)
      );

      await axios.delete(apiUrl + PROJECT_ROUTE + id);
      const newProjects = projects.filter(
        (project) => project._id !== id && project.user === userData._id
      );
      setProjects(newProjects);

      // Supprimer les pois associés au projet
      deleteProjectMarkers(id);

      // Mettre à jour l'utilisateur avec la list de projets modifiée
      await updateUserData(newProjects);
      closeLoadingBox();
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la suppression du projet:",
        error
      );
      closeLoadingBox();
    }
  };

  /**
   * Met à jour les données utilisateur avec la liste des projets modifiée
   * @param {array} newProjects
   * @async
   * @method
   * @throws {error} error
   */
  const updateUserData = async (newProjects) => {
    try {
      await axios.put(apiUrl + USER_ROUTE + userData._id, {
        projects: newProjects,
      });
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la mise à jour des données utilisateur:",
        error
      );
    }
  };

  /**
   * Affiche le projet sélectionné
   * @param {object} project
   */
  const handleProjectClick = (project) => {
    setSelectedProject(project._id);
    setModifiedName(project.name);
    setModifiedTag(project.tag);
    setVisibleComponent("PaletteMaker");
    setSelectedProjects([]);
  };

  /**
   * Vérifie si le nom du projet existe déjà
   * @param {event} e
   */
  const checkName = (e) => {
    setAfficheMessageErreur(true);
    setTimeout(() => {
      setAfficheMessageErreur(false);
    }, 5000);
  };

  /**
   * Vérifie si le nom du projet est vide
   * @param {event} e
   */
  const checkEmptyName = (e) => {
    setAfficheMessageErreurVide(true);
    setTimeout(() => {
      setAfficheMessageErreurVide(false);
    }, 5000);
  };

  /**
   * Vérifie si le type du projet est vide
   *  @param {event} e
   */
  const checkEmptyType = (e) => {
    setAfficheMessageErreurType(true);
    setTimeout(() => {
      setAfficheMessageErreurType(false);
    }, 5000);
  };

  /**
   * Met à jour le nom du projet
   * @param {event} e
   * @async
   * @method
   */
  const saveModified = async (e) => {
    e.preventDefault();
    //vérifier si le nom qu'on veut choisir n'existe pas déjà dans les noms des projets existants
    if (modifiedName !== editingProject.name) {
      if (projectsName.includes(modifiedName)) {
        checkName();
        console.log(projectsName);
        return;
      }
      if (modifiedName === "") {
        checkEmptyName();
        return;
      }
    }
    console.log("jest: Modification réussite");
    // mettre à jour le nom du projet
    await axios.put(apiUrl + PROJECT_ROUTE + editingProject._id, {
      name: modifiedName,
      tag: modifiedTag,
    });
    const updatedProjects = projects.map((p) => {
      if (p._id === editingProject._id) {
        return { ...p, name: modifiedName, tag: modifiedTag };
      }
      return p;
    });
    setProjects(updatedProjects);
    setModifiedName("");
    setModifiedTag("");
    setEditingProject(null);
  };

  /**
   * Déconnecte l'utilisateur
   */
  const disconnectUser = () => {
    sessionStorage.removeItem("userData");
    window.location.reload();
  };

  /**
   * Retourne à la liste des projets
   */
  const backToHub = () => {
    setSelectedProject(null);
    setSelectedProjects([]);
    setVisibleComponent("Hub");
    setCreateProject("btn btn-outline-primary mt-4");

    /**
     * Récupère les projets à jour de l'utilisateur
     * @async
     */
    async function MajProjects() {
      const res = await axios.get(apiUrl + PROJECT_ROUTE, {
        params: {
          user: userData._id,
        },
      });
      setProjects(res.data);
    }
    MajProjects();
  };

  /**
   * Dupliquer un projet existant
   * @param {object} project -Projet original a dupliquer
   */

  const duplicateProject = async (project) => {
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("duplicateProject"),
      text: t("messageDuplicationProject"),
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
      icon: "warning",
    });
    if (confirmDelete) {
      LoadingBox({
        text: "Duplication du projet en cours ...",
        icon: "info",
      });
      try {
        let newProjectName = `${project.name}_copie`;
        let copyNumber = 1;

        // Vérifier si le nom généré est déjà inclus dans projectNames
        while (projectsName.includes(newProjectName)) {
          newProjectName = `${project.name}_copie_${copyNumber}`;
          copyNumber++;
        }

        const newProject = {
          ...project,
          name: newProjectName,
          POIs: [],
        };

        const projectResponse = await axios.post(
          apiUrl + PROJECT_ROUTE,
          newProject
        );
        const duplicatedProject = projectResponse.data;
        const projectId = duplicatedProject._id;

        const updatedProjects = [...projects, duplicatedProject];
        setProjects(updatedProjects);

        const poiPromises = project.POIs.map(async (poiId) => {
          try {
            const response = await axios.get(apiUrl + POI_ROUTE + poiId);
            const originalPOI = response.data;

            //delete originalPOI.id;
            delete originalPOI._id;

            // redéfinire le champ 'Project_id'
            originalPOI.Project_id = projectId;

            await axios.post(apiUrl + POI_ROUTE + projectId, originalPOI);
          } catch (error) {
            console.error(
              `Erreur lors de la création du POI pour le projet avec l'ID ${projectId}`,
              error
            );
          }
        });
        await Promise.all(poiPromises);
        closeLoadingBox();
      } catch (error) {
        console.error("Erreur lors de la duplication du projet :", error);
      }
    }
  };

  const addToCart = (product) => {
    setCart((currentCart) => [...currentCart, product]);
  };

  return (
    <div className={`${theme} min-vh-100`}>
      <div className="hub-header d-flex flex-row align-items-center justify-content-between p-1 shadow-sm container-fluid">
        <div className="d-flex align-items-center">
          <img
            src="/rm_imgs/logo_header.png"
            alt="logo"
            className="logo-header  me-2"
          />
          <label className="fs-3 fw-bold col-2 me-4 d-none d-sm-block text-white">
            RoadMaker
          </label>
        </div>

        <label className="fs-6 fw-bold col-3 me-4 d-block d-sm-none tewt-white">
          RoadMaker
        </label>

        <label className="titleHeader fs-2 fw-bold col-3 d-none d-sm-block   me-5   text-white">
          {t("welcome")} {userName ? userName : userData.name}
        </label>

        <label className="fs-6 fw-bold col-3 d-block d-sm-none   me-4 text-white">
          {t("welcome")} {userName ? userName : userData.name}
        </label>

        <div>
          <Menu
            setVisibleComponent={setVisibleComponent}
            isAdmin={isAdmin}
            disconnectUser={disconnectUser}
            backToHub={backToHub}
            setAvatar={setAvatar}
            avatar={avatar}
            cart={cart}
            setCart={setCart}
            userData={userData}
            billingAddresses={billingAddresses}
          />
        </div>
      </div>

      <div>
        {visibleComponent !== "Form" ? (
          <div className="container">
            {visibleComponent === "Hub" && (
              <>
                <h2
                  className={
                    theme === "bg-white"
                      ? "text-dark fw-bold mt-2"
                      : "text-white mt-2 fw-bold"
                  }
                >
                  {t("yourCourses")}
                </h2>
                <ProjectsList
                  projects={projects}
                  handleProjectClick={handleProjectClick}
                  handleDeleteProject={handleDeleteProject}
                  setEditingProject={setEditingProject}
                  userData={userData}
                  setProjects={setProjects}
                  editingProject={editingProject}
                  setModifiedName={setModifiedName}
                  setModifiedTag={setModifiedTag}
                  saveModified={saveModified}
                  afficheMessageErreur={afficheMessageErreur}
                  afficheMessageErreurVide={afficheMessageErreurVide}
                  modifiedName={modifiedName}
                  modifiedTag={modifiedTag}
                  selectedProjects={selectedProjects}
                  setSelectedProjects={setSelectedProjects}
                  duplicateProject={duplicateProject}
                  createProject={createProject}
                  handleShowForm={() => setVisibleComponent("Form")}
                  deleteProjects={deleteProjects}
                  handleDeleteSelectedProjects={handleDeleteSelectedProjects}
                  theme={theme}
                />
              </>
            )}
          </div>
        ) : (
          <ProjectForm
            userData={userData}
            afficheMessageErreur={afficheMessageErreur}
            afficheMessageErreurType={afficheMessageErreurType}
            afficheMessageErreurVide={afficheMessageErreurVide}
            checkName={checkName}
            checkEmptyName={checkEmptyName}
            checkEmptyType={checkEmptyType}
          />
        )}
      </div>

      {visibleComponent === "Users" && (
        <UsersList
          handleDeleteProject={handleDeleteProject}
          deleteProjectMarkers={deleteProjectMarkers}
        />
      )}

      {visibleComponent === "MyProfile" && (
        <UserProfile
          userData={userData}
          userName={userName}
          setUserName={setUserName}
          setUserData={setUserData}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      )}

      {visibleComponent === "PaletteMaker" &&
        selectedProject &&
        selectedProjects.length === 0 && (
          <PaletteMaker
            projectId={selectedProject}
            userData={userData}
            userPack={userPack}
            setVisibleComponent={setVisibleComponent}
          />
        )}

      {visibleComponent === "BillingAdress" && (
        <BillingAddress
          userData={userData}
          setInvoiceBA={setInvoiceBA}
          invoiceBA={invoiceBA}
          billingAddresses={billingAddresses}
          setBillingAddresses={setBillingAddresses}
        />
      )}

      {visibleComponent === "Contact" && <Contact userData={userData} />}

      {visibleComponent === "Subscriptions" && (
        <Subscription
          userData={userData}
          setUserPack={setUserPack}
          setCart={setCart}
          addToCart={addToCart}
          cart={cart}
        />
      )}

      {visibleComponent === "CreditCard" && (
        <Elements stripe={stripeTestPromise}>
          <CreditCards userData={userData} />
        </Elements>
      )}

      {visibleComponent === "Invoices" && (
        <Invoices userData={userData} invoiceBA={invoiceBA} />
      )}

      {visibleComponent === "PaymentForm" && (
        <PaymentPage
          setUserPack={setUserPack}
          userData={userData}
          setCart={setCart}
          setPack={setPack}
          cart={cart}
        />
      )}
    </div>
  );
};

export default Home;
