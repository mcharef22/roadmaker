import { toast } from "react-toastify";
const notify = (type, message, options = {}) => {
  toast[type](message, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    ...options,
  });
};

export const customToastNotify = (type, message, nameProduct) => {
  const finalMessage = nameProduct ? `${nameProduct} ${message}` : message;
  notify(type, finalMessage);
};
