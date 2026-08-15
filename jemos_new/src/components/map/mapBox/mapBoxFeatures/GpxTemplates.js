export const generateGPXEMLFile = (
  projectName,
  customNavigationPoints,
  markers,
  markerTypes,
  originMarker,
  destinationMarker,
  destinationSameAsOrigin,
  trkseg,
  parcoursType,
  frenshTypes,
  coordinates,
  removeHtmlTags,
  translateManeuver,
  iconNumber,
  getDistanceValue,
  subTypeNumber,
  ICON_INDEX_PREFIX,
  strcuturePoiIcon,
  trkType,
) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="EcoMobile Loisirs" version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
      <metadata>
        <name><![CDATA[CIRCUIT ${projectName}]]></name>
        <link href="https://www.ecomobileloisirs.fr">
          <text>EcoMobile Loisirs</text>
        </link>
      </metadata>
    
      <!-- Points de Navigation -->
      ${customNavigationPoints
        .map((step) => {
          const cleanInstruction = removeHtmlTags(step.instructions);
          let location;
          if (typeof step.start_location == "string") {
            location = step.start_location;
          } else location = step.start_location.toUrlValue(6);
          const [lat, lng] = location.split(",");
          const type = frenshTypes.includes(step.maneuver)
            ? step.maneuver
            : translateManeuver(step.maneuver, cleanInstruction);
          if (type) {
            return `
              <wpt lat="${lat}" lon="${lng}">
                <ele>NaN</ele>
                <time> NaN </time>
                <name><![CDATA[]]></name>      
                <desc><![CDATA[${cleanInstruction}]]></desc>
                <sym>Waypoint</sym>
                <type>${type}</type>
                <extensions>
                  <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                    <om:ext type="ICON" subtype="0">${iconNumber(type)}</om:ext>
                    <om:ext type="DISTANCE">${getDistanceValue(
                      step.distance.value,
                    )}</om:ext>
                  </om:oruxmapsextensions>
                </extensions>
              </wpt>`;
          }
          return "";
        })
        .join("")}
      
      <!-- Points d'intérêts Standard -->
      ${markers
        .map((marker) => {
          let i = 0;
          if (marker.type.includes("info")) {
            i++;
            return `
              <wpt lat="${marker.lat}" lon="${marker.lng}">
                <ele>NaN</ele>
                <time> NaN </time>
                <name><![CDATA[${marker.title}]]></name>      
                <sym>Waypoint</sym>
                <desc>${marker.description}</desc>
                <type>${marker.subType}</type>
                <extensions>
                  <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                    <om:ext type="ICON" subtype="0">${subTypeNumber(
                      marker.subType,
                    )}</om:ext>
                    <om:ext type="DISTANCE">${marker.distanceToMarker}</om:ext>
                  </om:oruxmapsextensions>
                </extensions>
              </wpt>`;
          }
          return "";
        })
        .join("")}
    
        <!-- Points d'intérêts touristiques -->
        ${markers
          .filter((marker) => marker.type === markerTypes.touristic)
          .map((marker) => {
            let resourceType = "";
            if (
              marker.imageName &&
              marker.imageName.includes(marker.mainResource)
            ) {
              resourceType = "Image";
            } else if (
              marker.videoName &&
              marker.videoName.includes(marker.mainResource)
            ) {
              resourceType = "Video";
            } else if (
              marker.audioName &&
              marker.audioName.includes(marker.mainResource)
            ) {
              resourceType = "Audio";
            }

            return `
                    <wpt lat="${marker.lat}" lon="${marker.lng}">
                        <ele>NaN</ele>
                        <time> NaN </time>
                        <name><![CDATA[${marker.title}]]></name>
                        <desc><![CDATA[${marker.description}]]></desc>
                        <sym>Waypoint</sym>
                        <type></type>
                        <extensions>
                            <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                                <om:ext type="ICON" subtype="0">${marker.iconName.replace(
                                  ICON_INDEX_PREFIX,
                                  "",
                                )}</om:ext>
                                <om:ext type="DISTANCE">${
                                  marker.distanceToMarker
                                }</om:ext>
                                ${
                                  marker.mainResource
                                    ? `<om:ext type="IMAGEN" subtype="0">/storage/emulated/0/Circuits/Wpts/${resourceType}/${marker.mainResource}</om:ext>\n`
                                    : ""
                                }
                                ${
                                  marker.imageName &&
                                  marker.imageName.length > 0
                                    ? marker.imageName
                                        .filter(
                                          (image) =>
                                            image !== marker.mainResource,
                                        )
                                        .map(
                                          (image) =>
                                            `<om:ext type="IMAGEN" subtype="0">/storage/emulated/0/Circuits/Wpts/Image/${image}</om:ext>\n`,
                                        )
                                        .join("")
                                    : ""
                                }
                                ${
                                  marker.audioName &&
                                  marker.audioName.length > 0
                                    ? marker.audioName
                                        .filter(
                                          (audio) =>
                                            audio !== marker.mainResource,
                                        )
                                        .map(
                                          (audio) =>
                                            `<om:ext type="AUDIO" subtype="0">/storage/emulated/0/Circuits/Wpts/Audio/${audio}</om:ext>\n`,
                                        )
                                        .join("")
                                    : ""
                                }
                                ${
                                  marker.videoName &&
                                  marker.videoName.length > 0
                                    ? marker.videoName
                                        .filter(
                                          (video) =>
                                            video !== marker.mainResource,
                                        )
                                        .map(
                                          (video) =>
                                            `<om:ext type="VIDEO" subtype="0">/storage/emulated/0/Circuits/Wpts/Video/${video}</om:ext>\n`,
                                        )
                                        .join("")
                                    : ""
                                }
                            </om:oruxmapsextensions>
                        </extensions>
                    </wpt>
                `;
          })
          .join("")}
    
        
          <!--Points d'interêt de structure-->
          ${markers
            .filter(
              (marker) =>
                marker.type === markerTypes.origin ||
                (!destinationSameAsOrigin &&
                  marker.type === markerTypes.destination) ||
                marker.type === markerTypes.structure,
            )
            .map(
              (marker) => `
                  <wpt lat="${marker.lat}" lon="${marker.lng}">
                      <ele>NaN</ele>
                      <time> NaN </time>
                      <name><![CDATA[CIRCUIT ${projectName}]]></name>
                      <desc><![CDATA[${marker.description}]]></desc>
                      <sym>Waypoint</sym>
                      <type>${parcoursType}</type>
                      <extensions>
                          <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                              <om:ext type="ICON" subtype="0">${strcuturePoiIcon[parcoursType]}</om:ext>
                              <om:ext type="DISTANCE">${marker.distanceToMarker}</om:ext>
                          </om:oruxmapsextensions>
                      </extensions>
                  </wpt>
              `,
            )
            .join("")}            
                  
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
                    location,
                  ) => `<trkpt lat="${location.lat()}" lon="${location.lng()}"></trkpt>
                      `,
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
              <!-- Liste de points du circuit KML -->   
                ${coordinates
                  .map(
                    (coord) =>
                      `<trkpt lat="${coord.latitude}" lon="${coord.longitude}"></trkpt>
                      `,
                  )
                  .join("")}
              </trkseg>
              </trk>
              </gpx>`;
};

export const RoadPlayerGPX = (
  projectName,
  customNavigationPoints,
  markers,
  markerTypes,
  originMarker,
  destinationMarker,
  destinationSameAsOrigin,
  trkseg,
  parcoursType,
  frenshTypes,
  coordinates,
  removeHtmlTags,
  translateManeuver,
  iconNumber,
  getDistanceValue,
  subTypeNumber,
  ICON_INDEX_PREFIX,
  strcuturePoiIcon,
  trkType,
) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="EcoMobile Loisirs" version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name><![CDATA[CIRCUIT ${projectName}]]></name>
    <link href="https://www.ecomobileloisirs.fr">
      <text>EcoMobile Loisirs</text>
    </link>
  </metadata>

  <!-- Points de Navigation -->
  ${customNavigationPoints
    .map((step) => {
      const cleanInstruction = removeHtmlTags(step.instructions);
      let location;
      if (typeof step.start_location == "string") {
        location = step.start_location;
      } else location = step.start_location.toUrlValue(6);
      const [lat, lng] = location.split(",");
      const type = frenshTypes.includes(step.maneuver)
        ? step.maneuver
        : translateManeuver(step.maneuver, cleanInstruction);
      if (type) {
        return `
          <wpt lat="${lat}" lon="${lng}" id='waypoint'>
            <ele>NaN</ele>
            <time> NaN </time>
            <title><![CDATA[]]></title>    
            <desc><![CDATA[${cleanInstruction}]]></desc>
            <sym>Waypoint</sym>
            <type>${type}</type>
            <extensions>
              <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                <om:ext type="ICON" subtype="0">${iconNumber(type)}</om:ext>
                <om:ext type="DISTANCE">${getDistanceValue(
                  step.distance.value,
                )}</om:ext>
              </om:oruxmapsextensions>
            </extensions>
          </wpt>`;
      }
    })
    .join("")}
  
  <!-- Points d'intérêts Standard -->
  ${markers
    .map((marker) => {
      let i = 0;
      if (marker.type.includes("info")) {
        i++;
        return `
          <wpt lat="${marker.lat}" lon="${marker.lng}" id='information'>
            <ele>NaN</ele>
            <time> NaN </time>
            <title><![CDATA[${marker.title}]]></title>      
            <sym>Waypoint</sym>
            <desc>${marker.description}</desc>
            <type>${marker.subType}</type>
            <extensions>
              <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                <om:ext type="ICON" subtype="0">${subTypeNumber(
                  marker.subType,
                )}</om:ext>
                <om:ext type="DISTANCE">${marker.distanceToMarker}</om:ext>
              </om:oruxmapsextensions>
            </extensions>
          </wpt>`;
      }
    })
    .join("")}

    <!-- Points d'intérêts touristiques -->
      ${markers
        .filter((marker) => marker.type === markerTypes.touristic)
        .map((marker) => {
          const imageNames = marker.imageName
            ? marker.imageName.map(
                (imageName) =>
                  `<imageName><![CDATA[${imageName}]]></imageName>\n`,
              )
            : "";
          const imagesrc = marker.image
            ? marker.image.map(
                (image) => `<image><![CDATA[${image}]]></image>\n`,
              )
            : "";
          const videoNames = marker.videoName
            ? marker.videoName.map(
                (videoName) =>
                  `<videoName><![CDATA[${videoName}]]></videoName>\n`,
              )
            : "";
          const videosrc = marker.video
            ? marker.video.map(
                (video) => `<video><![CDATA[${video}]]></video>\n`,
              )
            : "";
          const audioNames = marker.audioName
            ? marker.audioName.map(
                (audioName) =>
                  `<audioName><![CDATA[${audioName}]]></audioName>\n`,
              )
            : "";
          const audiosrc = marker.audio
            ? marker.audio.map(
                (audio) => `<audio><![CDATA[${audio}]]></audio>\n`,
              )
            : "";
          const resourcesArray = marker.resourceArray
            ? marker.resourceArray.map(
                (resourceArray) =>
                  `<resourceArray><![CDATA[${resourceArray}]]></resourceArray>\n`,
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
                    .map((answer) => `<answer><![CDATA[${answer}]]></answer>`)
                    .join("\n");

                  const correctAnswersString = correctAnswers
                    .map(
                      (correct) =>
                        `<correctAnswer><![CDATA[${correct}]]></correctAnswer>`,
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
                    .map((answer) => `<answer><![CDATA[${answer}]]></answer>`)
                    .join("\n");

                  const titlesString = answersTitleArray
                    .map((title) => `<title><![CDATA[${title}]]></title>`)
                    .join("\n");

                  const correctAnswersString = correctAnswers
                    .map(
                      (correct) =>
                        `<correctAnswer><![CDATA[${correct}]]></correctAnswer>`,
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
              `<desc><![CDATA[${marker.description}]]></desc>`
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
                marker.iconName &&
                `<iconName><![CDATA[${marker.iconName}]]></iconName>`
              }
            </wpt>
          `;
        })}
    
    
      <!--Points d'interêt de structure-->
      ${markers
        .filter(
          (marker) =>
            marker.type === markerTypes.origin ||
            (!destinationSameAsOrigin &&
              marker.type === markerTypes.destination) ||
            marker.type === markerTypes.structure,
        )
        .map(
          (marker) => `
              <wpt lat="${marker.lat}" lon="${marker.lng}" id='structure'>
                  <ele>NaN</ele>
                  <time> NaN </time>
                  <title><![CDATA[CIRCUIT ${projectName}]]></title>
                  <desc><![CDATA[${marker.description}]]></desc>
                  <sym>Waypoint</sym>
                  <type>${parcoursType}</type>
                  <extensions>
                      <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
                          <om:ext type="ICON" subtype="0">${strcuturePoiIcon[parcoursType]}</om:ext>
                          <om:ext type="DISTANCE">${marker.distanceToMarker}</om:ext>
                      </om:oruxmapsextensions>
                  </extensions>
              </wpt>
          `,
        )
        .join("")}            
              
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
                location,
              ) => `<trkpt lat="${location.lat()}" lon="${location.lng()}"></trkpt>
                  `,
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
          <!-- Liste de points du circuit KML -->   
            ${coordinates
              .map(
                (coord) =>
                  `<trkpt lat="${coord.latitude}" lon="${coord.longitude}"></trkpt>
                  `,
              )
              .join("")}
          </trkseg>
          </trk>
          </gpx>`;
};
