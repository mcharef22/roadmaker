import Swal from "sweetalert2";

export const LoadingBox = ({
  text = "Opération en cours...",
  icon = "info",
  confirmButtonText = "",
}) => {
  Swal.fire({
    text,
    icon,
    confirmButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
  });
  Swal.showLoading();
};

export default LoadingBox;
export const closeLoadingBox = () => {
  Swal.close();
};

export const LoadingBoxWithProgressBar = () => {
  Swal.fire({
    icon: "info",
    title: "Transfert en cours...",
    html: '<progress max="35" id="progress-bar"></progress>',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      // on simule que c'est 30 seconde
      simulateProgressBar(35);
    },
  });
};

// Fonction pour simuler la barre de progression
const simulateProgressBar = (durationInSeconds) => {
  const progressBar = document.getElementById("progress-bar");
  let percentComplete = 0;
  const intervalMs = (durationInSeconds * 1000) / 35;

  const updateProgress = () => {
    percentComplete += 1;
    progressBar.value = percentComplete;
    if (percentComplete < 35) {
      setTimeout(updateProgress, intervalMs);
    } else {
      Swal.close();
    }
  };

  updateProgress();
};
