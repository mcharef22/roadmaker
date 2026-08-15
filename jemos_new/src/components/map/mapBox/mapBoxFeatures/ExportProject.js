import { trkType } from "./CompileProject";
import { URL_AUDIO, URL_VIDEO } from "../../gpx/Resources";
import { uploadFileToGithub } from "../../../util/Util";
export const ExportProject = async (
  projectName,
  markers,
  markerTypes,
  originMarker,
  destinationMarker,
  destinationSameAsOrigin,
  trkseg,
  parcoursType,
  uploadToGithub,
  customNavigationPoints
) => {
  const downloadTextFile = (text, name) => {
    const cleanText = text.replaceAll("base64,/", "base64/");
    const blob = new Blob([cleanText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();
  };

  const cleanText = (cleanGpx) => {
    return cleanGpx.replaceAll("base64,/", "base64/");
  };

  const GPXFile = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
  <gpx creator="Mindful house" version="1.0">
    <metadata>
      <name><![CDATA[CIRCUIT ${projectName}]]></name>
      <type><![CDATA[${parcoursType}]]></type>
      <link href="https://mindful-house.net/">
        <text>Mindful house</text>
      </link>
        <customNavigationPoints><![CDATA[${JSON.stringify(
          customNavigationPoints
        )}]]></customNavigationPoints>
    </metadata>
    <!-- Points de départ -->
    ${markers
      .filter((marker) => marker.type === markerTypes.origin)
      .map(
        (marker) => `
            <wpt lat="${marker.lat}" lon="${
          marker.lng
        }" id="depart" id-marker="${marker.id}">
              ${
                marker.description &&
                `<description><![CDATA[${marker.description}]]></description>`
              }
              ${marker.title && `<title><![CDATA[${marker.title}]]></title>`}
              <checkAudio><![CDATA[${marker.checkAudio}]]></checkAudio>
            </wpt>
        `
      )
      .join("\n")}

      <!-- Points de destination -->
      ${markers
        .filter((marker) => marker.type === markerTypes.destination)
        .map(
          (marker) => `
              <wpt lat="${marker.lat}" lon="${
            marker.lng
          }" id="destination" id-marker="${marker.id}">
                ${
                  marker.description &&
                  `<description><![CDATA[${marker.description}]]></description>`
                }
                ${marker.title && `<title><![CDATA[${marker.title}]]></title>`}
                <checkAudio><![CDATA[${marker.checkAudio}]]></checkAudio>
              </wpt>
          `
        )
        .join("\n")}
    <!-- Points de Navigation -->
    ${markers
      .filter((marker) => marker.type === markerTypes.step)
      .map((marker) => {
        return `
                  <wpt lat="${marker.lat}" lon="${marker.lng}" id="step">
                  </wpt>
              `;
      })
      .join("\n")}
        
      <!-- Points d'intérêts touristiques -->
      ${markers
        .filter((marker) => marker.type === markerTypes.touristic)
        .map((marker) => {
          const imageNames = marker.imageName
            ? marker.imageName
                .map(
                  (imageName) =>
                    `<imageName><![CDATA[${imageName}]]></imageName>\n`
                )
                .join("\n")
            : "";
          const imagesrc = marker.image
            ? marker.image
                .map((image) => `<image><![CDATA[${image}]]></image>\n`)
                .join("\n")
            : "";
          const videoNames = marker.videoName
            ? marker.videoName
                .map(
                  (videoName) =>
                    `<videoName><![CDATA[${videoName}]]></videoName>\n`
                )
                .join("\n")
            : "";
          const videosrc = marker.video
            ? marker.videoName
                .map(
                  (videoName) =>
                    `<video><![CDATA[${URL_VIDEO}${marker.id}${videoName}]]></video>\n`
                )
                .join("\n")
            : "";
          const audioNames = marker.audioName
            ? marker.audioName
                .map(
                  (audioName) =>
                    `<audioName><![CDATA[${audioName}]]></audioName>\n`
                )
                .join("\n")
            : "";

          const audiosrc = marker.audio
            ? marker.audioName.map(
                (audioName) =>
                  `<audio><![CDATA[${URL_AUDIO}${marker.id}${audioName}]]></audio>\n`
              )
            : "";
          const resourcesArray = marker.resourceArray
            ? marker.resourceArray.map(
                (resourceArray) =>
                  `<resourceArray><![CDATA[${resourceArray}]]></resourceArray>\n`
              )
            : "";
          const openQuestionArray = marker.openQuestionArray
            ? marker.openQuestionArray.map((questionObject) => {
                const { question, answer, successMessage, errorMessage } =
                  questionObject;
                return `<openQuestionArray>
            <question><![CDATA[${question}]]></question>
            <answer><![CDATA[${answer}]]></answer>
            <successMessage><![CDATA[${successMessage}]]></successMessage>
            <errorMessage><![CDATA[${errorMessage}]]></errorMessage>
          </openQuestionArray>\n`;
              })
            : "";

          const qcmArray = marker.qcmArray
            ? marker.qcmArray
                .map((qcmItem) => {
                  const {
                    question,
                    answersArray,
                    correctAnswers,
                    successMessage,
                    errorMessage,
                  } = qcmItem;

                  const answersString = answersArray
                    .map(
                      (answer) =>
                        `<answersArray><![CDATA[${answer}]]></answersArray>`
                    )
                    .join("\n");

                  const correctAnswersString = correctAnswers
                    .map(
                      (correct) =>
                        `<correctAnswers><![CDATA[${correct}]]></correctAnswers>`
                    )
                    .join("\n");
                  return `<qcmArray>
            <question><![CDATA[${question}]]></question>
            ${answersString}
            ${correctAnswersString}
            <successMessage><![CDATA[${successMessage}]]></successMessage>
            <errorMessage><![CDATA[${errorMessage}]]></errorMessage>
          </qcmArray>`;
                })
                .join("\n")
            : "";

          const qcmImageArray = marker.qcmImageArray
            ? marker.qcmImageArray
                .map((qcmImageItem) => {
                  const {
                    question,
                    answersTitleArray,
                    answersArray,
                    correctAnswers,
                    successMessage,
                    errorMessage,
                    imageName,
                  } = qcmImageItem;

                  const answersString = answersArray
                    .map(
                      (answer) =>
                        `<answersArray><![CDATA[${answer}]]></answersArray>`
                    )
                    .join("\n");

                  const titlesString = answersTitleArray
                    .map(
                      (title) =>
                        `<answersTitleArray><![CDATA[${title}]]></answersTitleArray>`
                    )
                    .join("\n");

                  const correctAnswersString = correctAnswers
                    .map(
                      (correct) =>
                        `<correctAnswers><![CDATA[${correct}]]></correctAnswers>`
                    )
                    .join("\n");

                  return `<qcmImageArray>
            <question><![CDATA[${question}]]></question>
            ${answersString}
            ${titlesString}
            ${correctAnswersString}
            <successMessage><![CDATA[${successMessage}]]></successMessage>
            <errorMessage><![CDATA[${errorMessage}]]></errorMessage>
            <imageName><![CDATA[${imageName}]]></imageName>
          </qcmImageArray>`;
                })
                .join("\n")
            : "";

          return `
            <wpt lat="${marker.lat}" lon="${
            marker.lng
          }" id="touristic" id-marker="${marker.id}">
            ${
              marker.description &&
              `<description><![CDATA[${marker.description}]]></description>`
            }
              ${marker.title && `<title><![CDATA[${marker.title}]]></title>`}
              <distance><![CDATA[${marker.distanceToMarker}]]></distance>
              <checkAudio><![CDATA[${marker.checkAudio}]]></checkAudio>
              ${imagesrc}
              ${imageNames}
              ${videosrc}
              ${videoNames}
              ${audiosrc}
              ${audioNames}
              ${resourcesArray}
              ${openQuestionArray}
              ${qcmArray}
              ${qcmImageArray}
              <mainResource><![CDATA[${marker.mainResource}]]></mainResource>
              <checkAcces><![CDATA[${marker.checkAcces}]]></checkAcces>
              <triggerType><![CDATA[${marker.triggerType}]]></triggerType>
              <triggerDistance><![CDATA[${
                marker.triggerDistance
              }]]></triggerDistance>
              <url><![CDATA[${marker.url}]]></url>
              ${
                marker.iconImage &&
                `<iconImage><![CDATA[${marker.iconImage}]]></iconImage>`
              }
              ${
                marker.iconNameWithoutBorder &&
                `<iconNameWithoutBorder><![CDATA[${marker.iconNameWithoutBorder}]]></iconNameWithoutBorder>`
              }
              ${
                marker.iconName &&
                `<iconName><![CDATA[${marker.iconName}]]></iconName>`
              }
            </wpt>
          `;
        })
        .join("\n")}
      

      <!-- Points d'interêt de structure -->
      ${markers
        .filter((marker) => marker.type === markerTypes.structure)
        .map(
          (marker) => `
              <wpt lat="${marker.lat}" lon="${
            marker.lng
          }" id="structure" id-marker="${marker.id}">
                ${
                  marker.description &&
                  `<description><![CDATA[${marker.description}]]></description>`
                }
                ${marker.title && `<title><![CDATA[${marker.title}]]></title>`}
                <checkAudio><![CDATA[${marker.checkAudio}]]></checkAudio>
              </wpt>
          `
        )
        .join("\n")}
      

      <!--Points d'information-->
      ${markers
        .map((marker) => {
          if (marker.type.includes("info")) {
            return `
            <wpt lat="${marker.lat}" lon="${
              marker.lng
            }" id="information" id-marker="${marker.id}">
            ${
              marker.description &&
              `<description><![CDATA[${marker.description}]]></description>`
            }
              ${marker.title && `<title><![CDATA[${marker.title}]]></title>`}
              <distance><![CDATA[${marker.distanceToMarker}]]></distance>
              <subType><![CDATA[${marker.subType}]]></subType>
              <checkAudio><![CDATA[${marker.checkAudio}]]></checkAudio>
            </wpt>
            `;
          }
          return "";
        })
        .join("\n")}

    <!--Trace-->
    <trk>
        <name><![CDATA[CIRCUIT ${projectName}]]></name>
        <desc><![CDATA[]]></desc>
        <type>Indéfini</type>
        <extensions>
            <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                <om:ext type="TYPE" subtype="0">0</om:ext>
                <om:ext type="DIFFICULTY">0</om:ext>
                <om:ext type="COLOR">${trkType(parcoursType)}</om:ext>
            </om:oruxmapsextensions>
        </extensions>
        <trkseg>
        <!-- Liste de points du circuit -->
        <trkpt
            lat="${originMarker.lat}"
            lon="${originMarker.lng}"
        ></trkpt>
        ${trkseg
          .map(
            (
              location
            ) => `<trkpt lat="${location.lat()}" lon="${location.lng()}"></trkpt>
                `
          )
          .join("")}
        ${
          destinationSameAsOrigin
            ? `<trkpt
            lat="${originMarker.lat}"
            lon="${originMarker.lng}"
        ></trkpt>`
            : `<trkpt
            lat="${destinationMarker.lat}"
            lon="${destinationMarker.lng}"
        ></trkpt>`
        }
        </trkseg>
        </trk>
        </gpx>`;

  if (uploadToGithub) {
    const fileName = `${projectName}.gpx`; // Générer le nom du fichier

    // Créer un Blob à partir du contenu GPX
    const blob = new Blob([cleanText(GPXFile)], { type: "text/plain" });

    // Créer un objet fichier à partir du Blob
    const file = new File([blob], fileName, { type: "text/plain" });

    try {
      // Envoyer le fichier à GitHub
      await uploadFileToGithub(file, null, "gpx");
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier à GitHub :", error);
    }
  } else {
    // Si uploadToGithub est faux, télécharger uniquement le fichier localement
    const fileName = `${projectName}.gpx`;
    console.log("GPX File Content:", GPXFile);
    downloadTextFile(GPXFile, fileName);
  }
};
