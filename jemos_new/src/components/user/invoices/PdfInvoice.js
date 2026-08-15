import React from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

import JemosLogo from "./images/jemos-logo.png";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../util/Util";

const PdfInvoice = ({
  idInvoice,
  numInvoice,
  nameProduct,
  dateInvoice,
  priceProduct,
  billingAddress,
  invoiceBA,
}) => {
  const { t, i18n } = useTranslation();
  const dateFacturation = formatDate(dateInvoice, i18n.language);
  const reciept = {
    id: idInvoice,
    invoice_no: numInvoice,
    address: invoiceBA
      ? `${invoiceBA.address} ${invoiceBA.zipCode} ${invoiceBA.city} ${
          invoiceBA.country
        }${invoiceBA.corporateName ? "\n" + invoiceBA.corporateName : ""}${
          invoiceBA.siret ? "\nSIRET: " + invoiceBA.siret : ""
        }`
      : t("billingAddressNotDefined"),
    date: dateFacturation,
    items: [
      {
        id: 1,
        desc: nameProduct,
        price: priceProduct,
      },
    ],
  };

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },

    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontStyle: "bold" },

    invoice: { fontWeight: "bold", fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: "bold",
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={JemosLogo} />
        <Text style={styles.reportTitle}>Mindful House</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>{t("invoice")} </Text>
          <Text style={styles.invoiceNumber}>
            {t("invoiceNumber")}: {reciept.invoice_no}{" "}
          </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>57 Bd Demorieux, </Text>
          <Text style={styles.addressTitle}>72000 Le Mans,</Text>
          <Text style={styles.addressTitle}>France</Text>
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>{t("invoiceTo")} </Text>
          <Text style={styles.address}>{reciept.address}</Text>
        </View>
        <Text style={styles.addressTitle}>{reciept.date}</Text>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>{t("product")}</Text>
      </View>
      <View style={styles.theader}>
        <Text>{t("HTprice")}</Text>
      </View>
      <View style={styles.theader}>
        <Text>{t("vat")}</Text>
      </View>
      <View style={styles.theader}>
        <Text>{t("totalAmount")}</Text>
      </View>
    </View>
  );

  const TableBody = () =>
    reciept.items.map((receipt) => (
      <Fragment key={receipt.id}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={[styles.tbody, styles.tbody2]}>
            <Text>{receipt.desc}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{receipt.price} </Text>
          </View>
          <View style={styles.tbody}>
            <Text>{receipt.price * 0.2}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{(receipt.price + receipt.price * 0.2).toFixed(2)}</Text>
          </View>
        </View>
      </Fragment>
    ));

  const TableTotal = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>
          {reciept.items
            .reduce((total, item) => total + item.price + item.price * 0.2, 0)
            .toFixed(2) + " €"}
        </Text>
      </View>
    </View>
  );

  const TableFooter = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>{t("vatRate")}</Text>
      </View>
      <View style={styles.tbody}>
        <Text>20%</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableTotal />
        <TableFooter />
      </Page>
    </Document>
  );
};

export default PdfInvoice;
