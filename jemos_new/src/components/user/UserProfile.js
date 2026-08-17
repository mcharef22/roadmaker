import React, { useState, useEffect } from "react";
import "../../components/style/global.css";
import { apiUrl } from "../../config";
import DialogBox from "../util/DialogBox";
import UserInfos from "./UserInfos";
import LoadingBox, { closeLoadingBox } from "../util/LoadingBox";
import { UpdateUserInfo } from "../util/mailHTML/UpdateUserInfo";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { useTranslation } from "react-i18next";
import {
  EMAIL_OF_USER_ROUTE,
  USERS_ROUTE,
  USER_ROUTE,
} from "../map/gpx/Resources";
import axiosInstance from "../../api/axiosInstance";

const UserProfile = ({
  userData,
  userName,
  setUserName,
  avatar,
  setAvatar,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [pack, setPack] = useState(userData.pack);
  const [userInformations, setUserInformations] = useState(null);

  const updateMainContent = `
    ${MailTemplateHeader("Mise à jour de vos informations")}${UpdateUserInfo(
      userData,
      "vos informations personnelles",
    )}`;

  /**
   * Récupère les données de l'utilisateur
   */
  const fetchUserData = async () => {
    LoadingBox({
      text: t("pleaseWait"),
      icon: "info",
    });
    try {
      const response = await axiosInstance.get(
        apiUrl + USER_ROUTE + userData._id,
      );
      closeLoadingBox();
      setEmail(response.data.email);
      setPack(response.data.pack);
      setAvatar(response.data.avatar);
      setUserInformations(response.data);
      return response;
    } catch (error) {
      console.log(error);
      closeLoadingBox();
    }
  };

  useEffect(() => {
    fetchUserData()
      .then((response) => {
        // Remplacer res par user
        setUserInformations(response.data);
      })
      .catch((err) => {
        console.log(err);
        DialogBox({
          title: t("error"),
          text: t("errorLoadingDatas"),
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  }, []);

  /**
   *
   * @param {event} e
   * Permet de valider les modification de l'utilisateur en cours
   */
  const handleValider = async (e) => {
    e.preventDefault();
    try {
      const usersResponse = await axiosInstance.get(apiUrl + USERS_ROUTE);
      const otherUsers = usersResponse.data.filter(
        (user) => user._id !== userData._id,
      );
      const emailExists = otherUsers.some((user) => user.email === email);
      if (emailExists) {
        DialogBox({
          text: t("existingEmail"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const htmlMessage = MailHTMLTemplate(updateMainContent);

      const response = await axiosInstance.put(
        apiUrl + USER_ROUTE + userData._id,
        {
          name: userName,
          email: email,
          pack: pack,
          avatar: avatar,
        },
      );
      setUserInformations(response.data);

      password &&
        (await axiosInstance.put(apiUrl + USER_ROUTE + userData._id, {
          password: password,
        }));
      await axiosInstance.post(apiUrl + EMAIL_OF_USER_ROUTE, {
        email: userData.email,
        subject: "Mise à jour de vos informations",
        message: htmlMessage,
      });
      DialogBox({
        text: t("updateInformations"),
        icon: "success",
        confirmButtonText: "OK",
      });
      console.log("email", email);

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * Permet d'annuler les modifications de l'utilisateur en cours
   */
  const handleAnnuler = () => {
    setIsEditing(false);
    setUserName(userInformations.name);
    setEmail(userInformations.email);
    setAvatar(userInformations.avatar);
  };

  /**
   *
   * @param {event} e
   * Permet de changer l'avatar de l'utilisateur
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      DialogBox({
        text: t("largeFile"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="container justify-content-center  p-4">
      <div className="d-flex justify-content-center">
        <div className="col-md-8  text-center">
          <div className="user-component">
            <div className="row justify-content-center">
              <div className="">
                <UserInfos
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setUserName={setUserName}
                  userName={userName}
                  email={email}
                  setEmail={setEmail}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  setPassword={setPassword}
                  setAvatar={setAvatar}
                  avatar={avatar}
                  handleAnnuler={handleAnnuler}
                  handleValider={handleValider}
                  handleAvatarChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
