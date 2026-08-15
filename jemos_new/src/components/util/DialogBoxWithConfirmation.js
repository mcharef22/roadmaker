import Swal from "sweetalert2";

const DialogBoxWithConfirmation = async ({
  title,
  text,
  icon,
  showCancelButton = true,
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  confirmButtonText,
  cancelButtonText,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
};

export default DialogBoxWithConfirmation;
