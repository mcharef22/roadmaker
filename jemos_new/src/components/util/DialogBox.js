import Swal from "sweetalert2";

/**
 * Création objet DialogBox
 * @param {string} text - Texte de la boite de dialogue
 * @param {string} icon - Icone de la boite de dialogue
 * @param {string} confirmButtonText - Texte du bouton de confirmation
 * @returns {object} DialogBox - Objet DialogBox venant d'être créé
 */
const DialogBox = ({ text, icon, confirmButtonText }) => {
  const result = Swal.fire({
    text,
    icon,
    confirmButtonText,
  });
  return result;
};

export default DialogBox;
