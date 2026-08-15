import Swal from "sweetalert2";

/**
 * Création objet DialogBoxWithFooter
 * @param {string} title - Titre de la boite de dialogue
 * @param {string} text - Texte de la boite de dialogue
 * @param {string} icon - Icone de la boite de dialogue
 * @param {string} confirmButtonText - Texte du bouton de confirmation
 * @param {string} footer - Texte du footer
 * @returns  {object} DialogBoxWithFooter  - Objet DialogBoxWithFooter  venant d'être créé
 */
const DialogBoxWithFooter = ({
  title,
  text,
  icon,
  confirmButtonText,
  footer,
  footerOnClick,
}) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    footer: `<button className="btn btn-warning"  id="footer-button">${footer}</button>`,
    didOpen: () => {
      const footerButton = document.getElementById("footer-button");
      if (footerButton) {
        footerButton.addEventListener("click", (event) => {
          event.preventDefault();
          Swal.close();
          footerOnClick();
        });
      }
    },
  });
};

export default DialogBoxWithFooter;
