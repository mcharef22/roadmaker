import React from "react";
import { customToastNotify } from "../util/Toast";
import { useState, useEffect } from "react";
import DialogBox from "../util/DialogBox";
import { priceOfCart } from "../util/Util";
import { useTranslation } from "react-i18next";
import { USER_ROUTE } from "../map/gpx/Resources";
import { apiUrl } from "../../config";
import axiosInstance from "../../api/axiosInstance";

const Cart = ({
  cart,
  setCart,
  setVisibleComponent,
  userData,
  billingAddresses,
}) => {
  const { t } = useTranslation();
  const [newUserInfo, setNewUserInfo] = useState(userData);
  const IMG_CART = "/rm_imgs/cart.png";

  useEffect(() => {
    const fetchData = async () => {
      const rep = await axiosInstance.get(USER_ROUTE + userData._id);

      setNewUserInfo(rep.data);
    };
    fetchData();
  }, [userData._id, billingAddresses]);

  const emptyCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    customToastNotify("success", t("cartEmptied"));
  };

  const removeProduct = (productToRemove) => {
    setCart(cart.filter((product) => product !== productToRemove));
    customToastNotify("success", t("removeFromCart"), productToRemove.name);
  };

  const paidCart = () => {
    if (newUserInfo.billingAddress.length === 0) {
      DialogBox({
        title: t("billingAddress"),
        text: t("addBA"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    setVisibleComponent("PaymentForm");
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-custom-large shadow-none mb-2 fs-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={t("cart")}
        aria-label="panier"
      >
        <img src={IMG_CART} alt="panier" />{" "}
      </button>

      <ul className="dropdown-menu p-3" aria-labelledby="dropdownMenuButton1">
        {cart.length === 0 ? (
          <li className="dropdown-item">{t("emptyCart")}</li>
        ) : (
          <>
            {cart.map((product, index) => (
              <li key={index} className="dropdown-item">
                {t("premiumSub")} - {product.price}€
                <i
                  className="bi bi-trash-fill ms-2 text-danger pe-auto"
                  onClick={() => {
                    removeProduct(product);
                  }}
                  aria-label="removeProduct"
                ></i>
              </li>
            ))}
            <div className="dropdown-divider"></div>

            <div className="d-flex flex-column">
              <button className="btn btn-primary mb-2" onClick={paidCart}>
                {" "}
                {t("pay")} {priceOfCart(cart)}€
              </button>
              <button className="btn btn-danger" onClick={emptyCart}>
                {t("clearCart")}
              </button>
            </div>
          </>
        )}
      </ul>
    </div>
  );
};

export default Cart;
