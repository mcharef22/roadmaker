import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axiosMock from "axios-mock-adapter";
import axios from "axios";
import DownloadFilesOnPhone from "../../src/components/DownloadFilesOnPhone";
import { apiUrl } from "../../src/config";
import i18n from "i18next";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/map/gpx/Resources", () => ({
  FILES_Route: "/files/",
}));

const mockAxios = new axiosMock(axios);
beforeEach(() => {
  global.URL.createObjectURL = jest.fn();
});

afterEach(() => {
  global.URL.createObjectURL.mockRestore();
});
const fileNames = ["file1", "file2"];

test("renders download button when fileNames exist", async () => {
  mockAxios.onGet(apiUrl + "/files").reply(200, fileNames);
  mockAxios
    .onGet(apiUrl + "/files/file1")
    .reply(200, new Blob(["file1 content"]));
  mockAxios
    .onGet(apiUrl + "/files/file2")
    .reply(200, new Blob(["file2 content"]));

  render(<DownloadFilesOnPhone />);

  await waitFor(() => {
    const downloadButton = screen.getByLabelText(i18n.t("Download"));
    expect(downloadButton).toBeInTheDocument();
  });
});
test("renders 'Aucun fichier disponible' text when fileNames do not exist", async () => {
  mockAxios.onGet("/files").reply(200, []);
  render(<DownloadFilesOnPhone />);

  await waitFor(() => {
    const noFilesText = screen.getByText(i18n.t("fileNotAvailable"));
    expect(noFilesText).toBeInTheDocument();
  });
});
test("calls handleDownloadAll when download button is clicked", async () => {
  jest.spyOn(console, "log");
  mockAxios.onGet(apiUrl + "/files").reply(200, fileNames);
  mockAxios
    .onGet(apiUrl + "/files/file1")
    .reply(200, new Blob(["file1 content"]));
  mockAxios
    .onGet(apiUrl + "/files/file2")
    .reply(200, new Blob(["file2 content"]));

  const handleDownloadAllMock = jest.fn();
  render(<DownloadFilesOnPhone handleDownloadAll={handleDownloadAllMock} />);

  await waitFor(() => {
    const downloadButton = screen.getByLabelText(i18n.t("Download"));
    fireEvent.click(downloadButton);
    expect(console.log).toHaveBeenCalledWith(
      "jest: Cliquer sur le boutton Tout télécharger"
    );
  });
});
