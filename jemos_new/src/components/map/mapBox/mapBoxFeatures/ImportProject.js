import { generateRandomNumber } from "../../../util/Util";
import { uploadBase64Image } from "../../../util/Util";
export const calculateGPXRoute = async (
  gpxContent,
  projectDatas,
  markerTypes,
  setOriginMarker,
  setDestinationMarker,
  setMarkers,
  calculateRoute,
  markers
) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, "text/xml");
  const GITHUB_REPO_IMAGES = "images";
  const GITHUB_REPO_ICONS = "icons";

  // Extraction des coordonnées du premier et dernier point du fichier GPX
  const trkpts = xmlDoc.querySelectorAll("trkpt");
  console.log(trkpts);
  const startLat = parseFloat(trkpts[0].getAttribute("lat"));
  const startLng = parseFloat(trkpts[0].getAttribute("lon"));
  const endLat = parseFloat(trkpts[trkpts.length - 1].getAttribute("lat"));
  const endLng = parseFloat(trkpts[trkpts.length - 1].getAttribute("lon"));

  const originMarker = Array.from(
    xmlDoc.querySelectorAll("wpt[id='depart']")
  ).map((wpt) => ({
    description:
      wpt.querySelector("desc") && wpt.querySelector("desc").textContent,
    title: wpt.querySelector("title") && wpt.querySelector("title").textContent,
    checkAudio:
      wpt.querySelector("checkAudio") &&
      wpt.querySelector("checkAudio").textContent,
  }));

  // Utilisez les données du premier marqueur de depart trouvé ou des valeurs par défaut
  const firstOriginMarker = originMarker[0] || {};
  const checkAudioValueOrigin = firstOriginMarker.checkAudio === "true";
  const startMarker = {
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: startLat,
    lng: startLng,
    type: markerTypes.origin,
    title: firstOriginMarker.title || "Point de origin",
    description: firstOriginMarker.description || "",
    checkAudio: checkAudioValueOrigin,
    Project_id: projectDatas._id,
  };

  const destinationMarker = Array.from(
    xmlDoc.querySelectorAll("wpt[id='destination']")
  ).map((wpt) => ({
    description:
      wpt.querySelector("desc") && wpt.querySelector("desc").textContent,
    title: wpt.querySelector("title") && wpt.querySelector("title").textContent,
    checkAudio:
      wpt.querySelector("checkAudio") &&
      wpt.querySelector("checkAudio").textContent,
  }));

  // Utilisez les données du premier marqueur de destination trouvé ou des valeurs par défaut
  const firstDestinationMarker = destinationMarker[0] || {};
  const checkAudioValueDestination = destinationMarker.checkAudio === "true";
  console.log(destinationMarker);

  const endMarker = {
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: endLat,
    lng: endLng,
    type: markerTypes.destination,
    title: firstDestinationMarker.title || "Point de destination",
    description: firstDestinationMarker.description || "",
    checkAudio: checkAudioValueDestination,
    Project_id: projectDatas._id,
  };

  // Extraction des coordonnées de tous les points d'information (type="info")
  const infoMarkersCoordinates = Array.from(
    xmlDoc.querySelectorAll("wpt[id='information']")
  ).map((wpt) => ({
    lat: parseFloat(wpt.getAttribute("lat")),
    lon: parseFloat(wpt.getAttribute("lon")),
    distance:
      wpt.querySelector("distance") &&
      wpt.querySelector("distance").textContent,
    subType:
      wpt.querySelector("subType") && wpt.querySelector("subType").textContent,
    description:
      wpt.querySelector("desc") && wpt.querySelector("desc").textContent,
    title: wpt.querySelector("title") && wpt.querySelector("title").textContent,
    checkAudio:
      wpt.querySelector("checkAudio") &&
      wpt.querySelector("checkAudio").textContent,
  }));

  // extraction des coordonnées de tous les points de navigation

  const wayPointsMarkersCoordiantes = Array.from(
    xmlDoc.querySelectorAll("wpt[id='waypoint']")
  ).map((wpt) => ({
    lat: parseFloat(wpt.getAttribute("lat")),
    lon: parseFloat(wpt.getAttribute("lon")),
  }));

  const touristicMarkersCoordinates = Array.from(
    xmlDoc.querySelectorAll("wpt[id='touristic']")
  ).map((wpt) => {
    const imageElements = wpt.querySelectorAll("image");
    const imageNameElements = wpt.querySelectorAll("imageName");
    const videoElements = wpt.querySelectorAll("video");
    const videoNameElements = wpt.querySelectorAll("videoName");
    const audioElements = wpt.querySelectorAll("audio");
    const audioNameElements = wpt.querySelectorAll("audioName");
    const resourceArrayElements = wpt.querySelectorAll("resourceArray");
    const qcmArray = wpt.querySelectorAll("qcmArray");
    const qcmImageArray = wpt.querySelectorAll("qcmImageArray");
    const openQuestionArray = wpt.querySelectorAll("openQuestionArray");

    return {
      lat: parseFloat(wpt.getAttribute("lat")),
      lon: parseFloat(wpt.getAttribute("lon")),
      distance:
        wpt.querySelector("distance") &&
        wpt.querySelector("distance").textContent,
      description:
        wpt.querySelector("desc") && wpt.querySelector("desc").textContent,
      title:
        wpt.querySelector("title") && wpt.querySelector("title").textContent,
      checkAudio:
        wpt.querySelector("checkAudio") &&
        wpt.querySelector("checkAudio").textContent,
      image: Array.from(imageElements).map((imageElement) => {
        return imageElement.textContent;
      }),
      imageName: Array.from(imageNameElements).map((imageNameElement) => {
        return imageNameElement.textContent;
      }),
      video: Array.from(videoElements).map((videoElement) => {
        return videoElement.textContent;
      }),
      videoName: Array.from(videoNameElements).map((videoNameElement) => {
        return videoNameElement.textContent;
      }),
      audio: Array.from(audioElements).map((audioElement) => {
        return audioElement.textContent;
      }),
      audioName: Array.from(audioNameElements).map((audioNameElement) => {
        return audioNameElement.textContent;
      }),
      resourceArray: Array.from(resourceArrayElements).map(
        (resourceArrayElement) => {
          return resourceArrayElement.textContent;
        }
      ),

      openQuestionArray: Array.from(openQuestionArray).map((element) => ({
        question:
          element.querySelector("question") &&
          element.querySelector("question").textContent,
        answer:
          element.querySelector("answer") &&
          element.querySelector("answer").textContent,
        successMessage:
          element.querySelector("successMessage") &&
          element.querySelector("successMessage").textContent,
        errorMessage:
          element.querySelector("errorMessage") &&
          element.querySelector("errorMessage").textContent,
      })),

      qcmArray: Array.from(qcmArray).map((element) => ({
        question:
          element.querySelector("question") &&
          element.querySelector("question").textContent,
        answersArray: Array.from(element.querySelectorAll("answersArray")).map(
          (answer) => answer.textContent
        ),
        correctAnswers: Array.from(
          element.querySelectorAll("correctAnswer")
        ).map((answer) => answer.textContent),
        successMessage:
          element.querySelector("successMessage") &&
          element.querySelector("successMessage").textContent,
        errorMessage:
          element.querySelector("errorMessage") &&
          element.querySelector("errorMessage").textContent,
      })),

      qcmImageArray: Array.from(qcmImageArray).map((element) => ({
        question:
          element.querySelector("question") &&
          element.querySelector("question").textContent,
        answersTitleArray: Array.from(element.querySelectorAll("title")).map(
          (answer) => answer.textContent
        ),
        answersArray: Array.from(element.querySelectorAll("answer")).map(
          (answer) => answer.textContent
        ),
        correctAnswers: Array.from(
          element.querySelectorAll("correctAnswer")
        ).map((answer) => answer.textContent),
        successMessage:
          element.querySelector("successMessage") &&
          element.querySelector("successMessage").textContent,
        errorMessage:
          element.querySelector("errorMessage") &&
          element.querySelector("errorMessage").textContent,
        imageName:
          element.querySelector("imageName") &&
          element.querySelector("imageName").textContent,
      })),

      mainResource:
        wpt.querySelector("mainResource") &&
        wpt.querySelector("mainResource").textContent,
      checkAcces:
        wpt.querySelector("checkAcces") &&
        wpt.querySelector("checkAcces").textContent,
      triggerType:
        wpt.querySelector("triggerType") &&
        wpt.querySelector("triggerType").textContent,
      triggerDistance:
        wpt.querySelector("triggerDistance") &&
        wpt.querySelector("triggerDistance").textContent,
      iconImage:
        wpt.querySelector("iconImage") &&
        wpt.querySelector("iconImage").textContent,
      iconName:
        wpt.querySelector("iconName") &&
        wpt.querySelector("iconName").textContent,
      iconNameWithoutBorder:
        wpt.querySelector("iconNameWithoutBorder") &&
        wpt.querySelector("iconNameWithoutBorder").textContent,
    };
  });
  console.log(touristicMarkersCoordinates);
  const structureMarkersCoordinates = Array.from(
    xmlDoc.querySelectorAll("wpt[id='structure']")
  ).map((wpt) => ({
    lat: parseFloat(wpt.getAttribute("lat")),
    lon: parseFloat(wpt.getAttribute("lon")),
    description:
      wpt.querySelector("desc") && wpt.querySelector("desc").textContent,
    title: wpt.querySelector("title") && wpt.querySelector("title").textContent,
    type: wpt.querySelector("type") && wpt.querySelector("type").textContent,
    checkAudio:
      wpt.querySelector("checkAudio") &&
      wpt.querySelector("checkAudio").textContent,
  }));
  const navigationMarkersCoordinates = Array.from(
    xmlDoc.querySelectorAll("wpt[id='step']")
  ).map((wpt) => ({
    lat: parseFloat(wpt.getAttribute("lat")),
    lon: parseFloat(wpt.getAttribute("lon")),
  }));

  setOriginMarker(startMarker);
  setDestinationMarker(endMarker);

  const informationMarkers = infoMarkersCoordinates.map((coord) => ({
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: coord.lat,
    lng: coord.lon,
    type: markerTypes.information,
    title: coord.title,
    description: coord.description,
    distanceToMarker: coord.distance,
    subType: coord.subType,
    checkAudio: coord.checkAudio === "true",
    Project_id: projectDatas._id,
  }));

  const wayPointsMarkers = wayPointsMarkersCoordiantes.map((coord) => ({
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: coord.lat,
    lng: coord.lon,
    type: markerTypes.step,
  }));

  const touristicMarkers = touristicMarkersCoordinates.map((coord) => ({
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: coord.lat,
    lng: coord.lon,
    type: markerTypes.touristic,
    title: coord.title,
    description: coord.description,
    distanceToMarker: coord.distance,
    checkAudio: coord.checkAudio === "true",
    image: Array.isArray(coord.image)
      ? coord.image.map((image) => image.replace(/base64/g, "base64,"))
      : coord.image,
    imageName: coord.imageName,
    video: Array.isArray(coord.video)
      ? coord.video.map((video) => video.replace(/base64/g, "base64,"))
      : coord.video,
    videoName: coord.videoName,
    audio: Array.isArray(coord.audio)
      ? coord.audio.map((audio) => audio.replace(/base64/g, "base64,"))
      : coord.audio,
    audioName: coord.audioName,
    mainResource: coord.mainResource,
    checkAcces: coord.checkAcces,
    triggerType: coord.triggerType,
    triggerDistance: coord.triggerDistance,
    iconName: coord.iconName,
    iconImage: coord.iconImage && coord.iconImage.replace(/base64/g, "base64,"),
    iconNameWithoutBorder: coord.iconNameWithoutBorder,
    resourceArray: coord.resourceArray,
    openQuestionArray: Array.isArray(coord.openQuestionArray)
      ? coord.openQuestionArray.map((question) => ({
          question: question.question,
          answer: question.answer,
          successMessage: question.successMessage,
          errorMessage: question.errorMessage,
        }))
      : [],
    qcmArray: Array.isArray(coord.qcmArray)
      ? coord.qcmArray.map((qcm) => ({
          question: qcm.question,
          answersArray: Array.isArray(qcm.answersArray) ? qcm.answersArray : [],
          correctAnswers: Array.isArray(qcm.correctAnswers)
            ? qcm.correctAnswers
            : [],
          successMessage: qcm.successMessage,
          errorMessage: qcm.errorMessage,
        }))
      : [],
    qcmImageArray: Array.isArray(coord.qcmImageArray)
      ? coord.qcmImageArray.map((qcmImage) => ({
          question: qcmImage.question,
          answersTitleArray: Array.isArray(qcmImage.answersTitleArray)
            ? qcmImage.answersTitleArray
            : [],
          answersArray: Array.isArray(qcmImage.answersArray)
            ? qcmImage.answersArray.map((answersArray) =>
                answersArray.replace(/base64/g, "base64,")
              )
            : qcmImage.answersArray,
          correctAnswers: Array.isArray(qcmImage.correctAnswers)
            ? qcmImage.correctAnswers
            : [],
          successMessage: qcmImage.successMessage,
          errorMessage: qcmImage.errorMessage,
          imageName: qcmImage.imageName,
        }))
      : [],
    Project_id: projectDatas._id,
  }));
  for (const marker of touristicMarkers) {
    if (marker.image) {
      for (let i = 0; i < marker.image.length; i++) {
        const imageData = marker.image[i];
        const imageName = marker.imageName[i];
        console.log(imageData);

        await uploadBase64Image(
          imageData,
          imageName,
          marker.id,
          GITHUB_REPO_IMAGES
        );
      }
    }

    // Process iconImage
    if (marker.iconImage) {
      const iconImageData = marker.iconImage;
      const iconImageName = marker.iconNameWithoutBorder;

      await uploadBase64Image(
        iconImageData,
        iconImageName,
        marker.id,
        GITHUB_REPO_ICONS
      );
    }
  }

  const structureMarkers = structureMarkersCoordinates.map((coord) => ({
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: coord.lat,
    lng: coord.lon,
    type: markerTypes.structure,
    title: coord.title,
    description: coord.description,
    checkAudio: coord.checkAudio === "true",
    Project_id: projectDatas._id,
  }));

  const navigationMarkers = navigationMarkersCoordinates.map((coord) => ({
    // à améliorer
    id: generateRandomNumber(1, 1000000000),
    lat: coord.lat,
    lng: coord.lon,
    type: markerTypes.step,
    title: "step",
    Project_id: projectDatas._id,
  }));
  setOriginMarker(startMarker);
  setDestinationMarker(endMarker);

  setMarkers([
    ...markers,
    startMarker,
    endMarker,
    ...wayPointsMarkers,
    ...structureMarkers,
    ...informationMarkers,
    ...touristicMarkers,
    ...navigationMarkers,
  ]);
  calculateRoute();
};
