import React from "react";
import Root from "./components/login/Root";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConfirmationPage from "./components/login/ConfirmationPage";
import Connexion from "./components/login/Connexion";
import ResetPage from "./components/login/password/ResetPage";
import ForgottenPassword from "./components/login/password/ForgottenPassword";
import DownloadFilesOnPhone from "./components/DownloadFilesOnPhone";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ErrorPage from "./ErrorPage";
import { ThemeProvider } from "./ThemeContext";
import "./i18n";

function App() {
  return (
    <>
      <ThemeProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/PageConfirmation" element={<ConfirmationPage />} />
            <Route path="/PageReinitialiser" element={<ResetPage />} />
            <Route path="/Connexion" element={<Connexion />} />
            <Route path="/ForgottenPassword" element={<ForgottenPassword />} />
            <Route
              path="/DownloadFilesOnPhone"
              element={<DownloadFilesOnPhone />}
            />
            {/*route pour les pages qui n'existent pas -> page 404*/}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
