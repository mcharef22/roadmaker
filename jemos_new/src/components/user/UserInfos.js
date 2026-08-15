import React from "react";
import { useTranslation } from "react-i18next";

const UserInfos = ({
  isEditing,
  setIsEditing,
  setUserName,
  userName,
  email,
  setEmail,
  showPassword,
  setShowPassword,
  setPassword,
  setAvatar,
  avatar,
  handleAnnuler,
  handleValider,
  handleAvatarChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="row">
      <div className="col-xl-4">
        <div className="card mb-4 mb-xl-0 shadow">
          <div className="card-header">{t("profilPicture")}</div>
          <div className="card-body text-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Photo de profil"
                className=" rounded-circle w-50"
              />
            ) : (
              <p>{t("profilePictureSentence")}</p>
            )}
            {isEditing ? (
              <input
                className="form-control mb-2 mt-4"
                type="file"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleAvatarChange}
              />
            ) : null}

            <div className="small font-italic text-muted mb-4">
              {t("profilPictureLimitation")}
            </div>
          </div>
        </div>
      </div>
      <form
        className="col-xl-8"
        onSubmit={(e) => {
          handleValider(e);
        }}
      >
        <div className="card mb-4 shadow">
          <div className="card-header">{t("personnalInformations")}</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">{t("name")} : </label>
              {isEditing ? (
                <input
                  className="form-control"
                  type="text"
                  defaultValue={userName}
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              ) : (
                <span className="fw-semibold"> {userName}</span>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t("email")} : </label>
              {isEditing ? (
                <input
                  className="form-control"
                  type="email"
                  defaultValue={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <span className="fw-semibold"> {email}</span>
              )}
            </div>
            <div className="mb-5">
              <label className="form-label">{t("password")} : </label>
              {isEditing ? (
                <div className="input-group mb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder={t("writeNewPwd")}
                    defaultValue={""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className="bi bi-eye-slash"></i>
                  </button>
                </div>
              ) : (
                <span className="fs-5">{" ••••••••••••"}</span>
              )}
            </div>
          </div>
        </div>
        {isEditing !== true ? (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-warning"
              onClick={() => {
                isEditing ? setIsEditing(false) : setIsEditing(true);
              }}
            >
              {" "}
              {t("edit")}{" "}
            </button>
          </div>
        ) : null}
        <div className="d-flex justify-content-center">
          {isEditing ? (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-danger col-md-8 m-2"
                onClick={handleAnnuler}
              >
                {t("cancel")}
              </button>
              <button className="btn btn-primary col-md-8 m-2" type="submit">
                {t("accept")}
              </button>
            </div>
          ) : null}
        </div>
      </form>
    </div>
    // </div>
  );
};

export default UserInfos;
