module.exports = {
  fire: (options = {}) => {
    const modal = document.createElement("div");
    modal.setAttribute("role", "dialog");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.zIndex = "9999";

    const content = document.createElement("div");
    const contentText = document.createTextNode(
      options.title || options.text || options.html || "",
    );
    content.appendChild(contentText);
    modal.appendChild(content);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = options.confirmButtonText || "yes";
    confirmBtn.setAttribute("data-swal-confirm", "true");
    modal.appendChild(confirmBtn);

    if (options.showCancelButton) {
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = options.cancelButtonText || "no";
      cancelBtn.setAttribute("data-swal-cancel", "true");
      modal.appendChild(cancelBtn);
    }

    document.body.appendChild(modal);

    return new Promise((resolve) => {
      confirmBtn.addEventListener("click", () => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
        resolve({ isConfirmed: true });
      });
      const cancel = modal.querySelector("[data-swal-cancel]");
      if (cancel) {
        cancel.addEventListener("click", () => {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
          resolve({ isConfirmed: false });
        });
      }
    });
  },
  showLoading: () => {},
  close: () => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  },
};
