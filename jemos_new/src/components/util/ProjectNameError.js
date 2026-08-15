import React from "react";
import { useTranslation } from "react-i18next";
/**
 * Notifie l'utilisateur si le nom du parcours existe déjà
 * @returns un message d'erreur si le nom du parcours existe déjà
 */

export function ProjectNameError() {
  const { t } = useTranslation();

  return (
    <div className="alert alert-danger m-1">{t("duplicateNameError")} </div>
  );
}

/**
 * Notifie l'utilisateur si le nom du parcours est vide
 * @returns un message d'erreur si le nom du parcours est vide
 */
export function EmptyProjectNameError() {
  const { t } = useTranslation();

  return <div className="alert alert-danger m-1">{t("emptyNameError")} </div>;
}

/**
 * Notifie l'utilisateur si le type du parcours est vide
 * @returns un message d'erreur si le type du parcours est vide
 */
export function ProjectTypeError() {
  const { t } = useTranslation();

  return <div className="alert alert-danger m-1">{t("emptyTypeError")} </div>;
}
