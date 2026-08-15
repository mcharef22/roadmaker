import React, { useEffect, useState } from "react";
import axios from "axios";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import {
  INITIAL_ICON_INDEX_ARRAY,
  USERS_ROUTE,
  USER_ROUTE,
} from "../../map/gpx/Resources";
import UsersFilterOptions from "./UsersFilterOptions";
import { formatDate, sortByDate, filterItems } from "../../util/Util";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../../../config";

const UsersList = ({ handleDeleteProject }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState();
  const [pack, setPack] = useState("");
  const [admin, setAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [confirmedFilter, setConfirmedFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [newIndexValues, setNewIndexValues] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    /**
     * Permet de récupérer les différents utilisateurs
     */
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl + USERS_ROUTE);
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    console.log(adminFilter);
    fetchUsers();
  }, []);

  const sortedUsers = filterItems(users, [
    { key: "name", value: searchTerm },
    { key: "admin", value: adminFilter },
    { key: "confirmed", value: confirmedFilter },
  ]);
  const filteredUsers = sortByDate(
    sortedUsers,
    (user) => new Date(user.dateOfCreation),
    sortOrder
  );

  /**
   * Permet de lancer la suppression d'un utilisateur
   * @param {string} userId
   */

  const handleDeleteUser = async (userId) => {
    console.log("jest: Fonction de suppression est appelée");
    try {
      // Récupérer l'utilisateur que vous souhaitez supprimer
      const response = await axios.get(apiUrl + USER_ROUTE + userId);
      const user = response.data;

      const confirmDelete = await DialogBoxWithConfirmation({
        title: t("userDeletion"),
        text: t("userDeleteConfirmation"),
        icon: "warning",
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
      });

      // Confirmer la suppression
      if (confirmDelete) {
        const projectIds = user.projects;

        for (const projectId of projectIds) {
          const e = { stopPropagation: () => {} };
          await handleDeleteProject(projectId, true)(e);
        }

        // Supprimer l'utilisateur
        await axios.delete(apiUrl + USER_ROUTE + userId);

        // Mettre à jour la liste des utilisateurs
        const newUsers = users.filter((user) => user._id !== userId);
        setUsers(newUsers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Permet de mettre à jour l'utilisateur
   * @param {string} userId
   */

  const handleUpdateUser = async (userId) => {
    try {
      const userToUpdate = users.find((user) => user._id === userId);
      if (!userToUpdate) {
        return;
      }

      let updatedUser = { ...userToUpdate };
      if (name !== "") {
        updatedUser.name = name;
      }
      if (email !== "") {
        updatedUser.email = email;
      }
      if (confirmed || !confirmed) {
        updatedUser.confirmed = confirmed;
      }

      if (pack !== "") {
        updatedUser.pack = pack;
      }

      if (admin || !admin) {
        updatedUser.admin = admin;
      }

      if (newIndexValues !== "") {
        const newIndexArray = newIndexValues
          .split("\n")
          .map((val) => val.trim());
        updatedUser.iconIndexArray = newIndexArray;
      }

      delete updatedUser.password;

      await axios.put(apiUrl + USER_ROUTE + userId, updatedUser);
      const updatedUsers = users.map((user) => {
        if (user._id === userId) {
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedUserId("");
      setName("");
      setEmail("");
      setNewIndexValues("");
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Permet de réinitialiser l'index de l'utilisateur
   * @param {string} userId - id de l'utilisateur
   */

  const handleResetIndex = async (userId) => {
    try {
      const userToUpdate = users.find((user) => user._id === userId);
      if (!userToUpdate) {
        return;
      }

      const updatedUser = {
        ...userToUpdate,
        iconIndexArray: INITIAL_ICON_INDEX_ARRAY,
      };

      const confirmResetIndex = await DialogBoxWithConfirmation({
        title: t("resetIconsIndex"),
        text: t("confirmationResetIndexIcons"),
        icon: "info",
        confirmButtonText: t("yes"),
        cancelButtonText: t("no"),
      });

      if (confirmResetIndex) {
        await axios.put(apiUrl + USER_ROUTE + userId, {
          iconIndexArray: updatedUser.iconIndexArray,
        });
        const updatedUsers = users.map((user) => {
          if (user._id === userId) {
            return updatedUser;
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UsersFilterOptions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAdminFilter={adminFilter}
        setIsAdminFilter={setAdminFilter}
        isConfirmedFilter={confirmedFilter}
        setIsConfirmedFilter={setConfirmedFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <ul className="list-group">
        <div className="list-group-item list-group-item-action">
          <div className="row">
            <div className="col">
              <span className="text-info">{t("name")}</span>
            </div>
            <div className="col-2">
              <span className="text-info">{t("email")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("confirmed")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">Admin</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">Pack</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("creationDate")}</span>
            </div>
            <div className="col-1 d-flex justify-content-center">
              <span className="text-info">{t("projectNumber")}</span>
            </div>
            <div className="col-2 d-flex justify-content-center">
              <span className="text-info">Index</span>
            </div>
            <div className="col-2 d-flex justify-content-center">
              <span className="text-info">Actions</span>
            </div>
          </div>
        </div>
        {filteredUsers.map((user, index) => (
          <div className="list-group-item" key={user._id}>
            <div className="row" key={user._id}>
              <div className="col">
                {selectedUserId === user._id ? (
                  <input
                    className="form-control"
                    type="text"
                    aria-label={`Name-${index}`}
                    defaultValue={user.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </div>
              <div className="col-2">
                {selectedUserId === user._id ? (
                  <input
                    className="form-control"
                    type="email"
                    aria-label={`email-${index}`}
                    defaultValue={user.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </div>
              <div className="col d-flex justify-content-center">
                {selectedUserId === user._id ? (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    aria-label={`confirm-${index}`}
                    checked={
                      confirmed || !confirmed ? confirmed : user.confirmed
                    }
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                ) : (
                  <input
                    disabled
                    className="form-check-input"
                    type="checkbox"
                    aria-label={`confirmValue-${index}`}
                    checked={user.confirmed}
                  />
                )}
              </div>
              <div className="col d-flex justify-content-center">
                {selectedUserId === user._id ? (
                  <input
                    className="form-check-input"
                    type="checkbox"
                    aria-label={`admin-${index}`}
                    checked={admin ?? user.admin}
                    onChange={(e) => setAdmin(e.target.checked)}
                  />
                ) : (
                  <input
                    disabled
                    className="form-check-input"
                    type="checkbox"
                    aria-label={`adminValue-${index}`}
                    checked={user.admin}
                  />
                )}
              </div>
              <div className="col d-flex justify-content-center">
                <b onDoubleClick={() => setShowSelect(!showSelect)}>
                  {selectedUserId === user._id ? (
                    <select
                      className="form-select"
                      aria-label={`pack-${index}`}
                      defaultValue={user.pack}
                      onChange={(e) => {
                        setPack(e.target.value);
                        setShowSelect(false);
                      }}
                    >
                      <option value="Standard" aria-label="StandardPack">
                        {" "}
                        Standard
                      </option>
                      <option value="Premium" aria-label="PremiumPack">
                        {" "}
                        Premium
                      </option>
                    </select>
                  ) : (
                    user.pack
                  )}
                </b>
              </div>
              <div className="col d-flex justify-content-center">
                <span>
                  <b>
                    {user.dateOfCreation
                      ? formatDate(user.dateOfCreation, i18n.language)
                      : "Inconnue"}
                  </b>
                </span>
              </div>
              <div className="col-1 d-flex justify-content-center">
                <span>
                  <b>{user.projects.length}</b>
                </span>
              </div>
              {selectedUserId === user._id ? (
                <>
                  <div className="col-2 d-flex justify-content-center">
                    <textarea
                      defaultValue=""
                      onChange={(e) => setNewIndexValues(e.target.value)}
                      aria-label={`textArea-${index}`}
                    ></textarea>
                  </div>

                  <div className="col-2 d-flex justify-content-center">
                    <button
                      className="btn btn-outline-primary float-end me-3"
                      onClick={() => handleUpdateUser(user._id)}
                      data-testid={`btn-sauvegarder-${index}`}
                    >
                      {t("save")}
                    </button>
                    <button
                      className="btn btn-outline-secondary float-end me-3"
                      onClick={() => setSelectedUserId("")}
                      data-testid={`btn-annuler-${index}`}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-2 d-flex justify-content-center">
                    <button
                      className="btn btn-outline-primary me-3"
                      onClick={() => handleResetIndex(user._id)}
                      aria-label="btn-reset"
                      data-testid={`btn-reset-${index}`}
                    >
                      {t("reset")}
                    </button>
                  </div>
                  <div className="col-2 d-flex justify-content-center">
                    <button
                      className="btn btn-outline-warning me-3"
                      onClick={() => setSelectedUserId(user._id)}
                      aria-label="btn-modifier"
                      data-testid={`btn-modifier-${index}`}
                    >
                      {t("edit")}
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteUser(user._id)}
                      data-testid={`btn-supprimer-${index}`}
                    >
                      {t("delete")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </ul>
    </>
  );
};

export default UsersList;
