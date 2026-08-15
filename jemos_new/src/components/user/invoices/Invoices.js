import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import PdfInvoice from "./PdfInvoice";
import axios from "axios";
import { apiUrl } from "../../../config";
import { formatDate } from "../../util/Util";
import { useTranslation } from "react-i18next";

const Invoices = ({ userData, invoiceBA }) => {
  const [invoices, setInvoices] = useState([]);
  const [billingAddress, setBillingAddress] = useState({});

  useEffect(() => {
    // Fetch invoices for the specified user ID
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/invoices/user/" + userData._id
        );
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    const fetchBillingAddress = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/billingAddresses/user/" + userData._id
        );
        const selectedAddress = response.data.find(
          (address) => address.selected
        );

        setBillingAddress(selectedAddress);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchBillingAddress();
    fetchInvoices();
  }, [userData._id]);

  const { t, i18n } = useTranslation();
  return (
    <div className="d-flex flex-sm-row flex-xs-column mt-4 justify-content-center">
      <div className="col-xl-5">
        <div className="card mb-4 mb-xl-0 shadow">
          <div className="card-header fw-bolder">{t("myInvoices")}</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">{t("product")}</th>
                  <th scope="col">{t("price")}</th>
                  <th scope="col">{t("purchaseDate")}</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.nameProduct}</td>
                    <td>{invoice.priceProduct}</td>
                    <td>{formatDate(invoice.dateInvoice, i18n.language)}</td>
                    <td>
                      <PDFDownloadLink
                        document={
                          <PdfInvoice
                            idInvoice={invoice._id}
                            numInvoice={invoice.numInvoice}
                            nameProduct={invoice.nameProduct}
                            dateInvoice={formatDate(invoice.dateInvoice)}
                            priceProduct={invoice.priceProduct}
                            // billingAddress={billingAddress}
                            invoiceBA={invoiceBA}
                          />
                        }
                        fileName={`invoice_${invoice.numInvoice}.pdf`}
                      >
                        <button className="btn btn-primary">
                          {t("download")}
                        </button>
                      </PDFDownloadLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
