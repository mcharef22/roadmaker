import React from "react";
import OpenQuestionMarkerForm from "./OpenQuestionMarkerForm";
import { useTranslation } from "react-i18next";
import "../../style/global.css";
import QcmMarkerForm from "./QcmMarkerForm";
import { DEFAULT_EMPTY_TEXT } from "../../map/gpx/Resources";
import QcmImageMarkerForm from "./QcmImageMarkerForm";
import { uploadFileToGithub } from "../../util/Util";
import DialogBox from "../../util/DialogBox";
import LoadingBox, { closeLoadingBox } from "../../util/LoadingBox";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";

const QuizMarkerForm = ({
  marker,
  markerOpenQuestion,
  setMarkerOpenQuestion,
  markerQcmArray,
  setMarkerQcmArray,
  markerQcmImageArray,
  setMarkerQcmImageArray,
  handleInputFocus,
  handleInputBlur,
}) => {
  const { t } = useTranslation();
  const GITHUB_REPO_IMAGES = "images";
  const OPEN_QUESTION = "openQuestion";
  const QCM = "qcm";
  const QCM_IMAGE = "qcmImage";
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const completedQuestionForm = (questionForm) => {
    let questionFormCompleted = false;
    if (questionForm === "OpenQuestionMarkerForm") {
      if (
        markerOpenQuestion.length === 0 ||
        (markerOpenQuestion[markerOpenQuestion.length - 1].question !==
          DEFAULT_EMPTY_TEXT &&
          markerOpenQuestion[markerOpenQuestion.length - 1].answer !==
            DEFAULT_EMPTY_TEXT)
      ) {
        questionFormCompleted = true;
      }
    } else if (questionForm === "QcmMarkerForm") {
      if (
        markerQcmArray.length === 0 ||
        (markerQcmArray[markerQcmArray.length - 1].question !==
          DEFAULT_EMPTY_TEXT &&
          markerQcmArray[markerQcmArray.length - 1].answersArray.every(
            (answer) => answer !== DEFAULT_EMPTY_TEXT
          ) &&
          markerQcmArray[markerQcmArray.length - 1].correctAnswers.length > 0)
      ) {
        questionFormCompleted = true;
      }
    } else if (questionForm === "QcmImageMarkerForm") {
      if (
        markerQcmImageArray.length === 0 ||
        (markerQcmImageArray[markerQcmImageArray.length - 1].question !==
          DEFAULT_EMPTY_TEXT &&
          markerQcmImageArray[
            markerQcmImageArray.length - 1
          ].answersArray.every((answer) => answer !== DEFAULT_EMPTY_TEXT) &&
          markerQcmImageArray[markerQcmImageArray.length - 1].correctAnswers
            .length > 0)
      ) {
        questionFormCompleted = true;
      }
    }

    return questionFormCompleted;
  };

  const handleDeleteQuestion = (index, type) => async (e) => {
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteQuiz"),
      text: t("deleteQuizText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });
    if (confirmDelete) {
      
    if (type === OPEN_QUESTION) {
      setMarkerOpenQuestion((prevArray) =>
        prevArray.filter((_, i) => i !== index)
      );
    } else if (type === QCM) {
      setMarkerQcmArray((prevArray) => prevArray.filter((_, i) => i !== index));
    } else if (type === QCM_IMAGE) {
      setMarkerQcmImageArray((prevArray) =>
        prevArray.filter((_, i) => i !== index)
      );
    }
  }
  };

  //////////////////////// Pour les questions ouvertes /////////////////////////////
  const addQuestion = (event) => {
    event.preventDefault();
    if (completedQuestionForm("OpenQuestionMarkerForm")) {
      setMarkerOpenQuestion([
        ...markerOpenQuestion,
        {
          question: DEFAULT_EMPTY_TEXT,
          answer: DEFAULT_EMPTY_TEXT,
          successMessage: DEFAULT_EMPTY_TEXT,
          errorMessage: DEFAULT_EMPTY_TEXT,
        },
      ]);
    }
  };

  const handleQuestionChange = (value, index) => {
    const newQuestions = [...markerOpenQuestion];
    newQuestions[index] = {
      ...newQuestions[index],
      question: value,
    };
    setMarkerOpenQuestion(newQuestions);
  };

  const handleAnswerChange = (value, index) => {
    const newAnswers = [...markerOpenQuestion];
    newAnswers[index] = {
      ...newAnswers[index],
      answer: value,
    };
    setMarkerOpenQuestion(newAnswers);
  };

  const handleSuccessMessageChange = (value, index) => {
    const newSuccessMessages = [...markerOpenQuestion];
    newSuccessMessages[index] = {
      ...newSuccessMessages[index],
      successMessage: value,
    };
    setMarkerOpenQuestion(newSuccessMessages);
  };

  const handleErrorMessageChange = (value, index) => {
    const newErrorMessages = [...markerOpenQuestion];
    newErrorMessages[index] = {
      ...newErrorMessages[index],
      errorMessage: value,
    };
    setMarkerOpenQuestion(newErrorMessages);
  };

  //////////////////////// Pour le qcm /////////////////////////////
  const handleAddAnswer = (event, questionIndex) => {
    event.preventDefault();

    const newArray = [...markerQcmArray];
    if (newArray[questionIndex].answersArray.length < 13) {
      newArray[questionIndex].answersArray.push(DEFAULT_EMPTY_TEXT);
      setMarkerQcmArray(newArray);
    }
  };

  const addQcmQuestion = (event) => {
    event.preventDefault();
    if (completedQuestionForm("QcmMarkerForm")) {
      setMarkerQcmArray([
        ...markerQcmArray,
        {
          question: DEFAULT_EMPTY_TEXT,
          answersArray: [DEFAULT_EMPTY_TEXT, DEFAULT_EMPTY_TEXT],
          correctAnswers: [],
          successMessage: DEFAULT_EMPTY_TEXT,
          errorMessage: DEFAULT_EMPTY_TEXT,
        },
      ]);
    }
  };

  const handleQcmQuestionChange = (value, index) => {
    const newArray = [...markerQcmArray];
    newArray[index].question = value;
    setMarkerQcmArray(newArray);
  };

  const handleQcmAnswerChange = (value, questionIndex, answerIndex) => {
    const newArray = [...markerQcmArray];
    newArray[questionIndex].answersArray[answerIndex] = value;
    setMarkerQcmArray(newArray);
  };

  const handleQcmSuccessMessageChange = (value, index) => {
    const newArray = [...markerQcmArray];
    newArray[index].successMessage = value;
    setMarkerQcmArray(newArray);
  };

  const handleQcmErrorMessageChange = (value, index) => {
    const newArray = [...markerQcmArray];
    newArray[index].errorMessage = value;
    setMarkerQcmArray(newArray);
  };

  const handlecorrectAnswersChange = (event, questionIndex, answerIndex) => {
    const newArray = [...markerQcmArray];
    const correctAnswers = newArray[questionIndex].correctAnswers || [];
    if (event.target.checked) {
      // Add answer index to correctAnswers
      newArray[questionIndex].correctAnswers = [...correctAnswers, answerIndex];
    } else {
      // Remove answer index from correctAnswers
      newArray[questionIndex].correctAnswers = correctAnswers.filter(
        (index) => index !== answerIndex
      );
    }
    setMarkerQcmArray(newArray);
  };

  //////////////////////// Pour le qcmImage /////////////////////////////

  const handleAddImageAnswer = (event, questionIndex) => {
    event.preventDefault();

    const newArray = [...markerQcmImageArray];
    if (newArray[questionIndex].answersArray.length < 13) {
      newArray[questionIndex].answersArray.push(DEFAULT_EMPTY_TEXT);
      setMarkerQcmImageArray(newArray);
    }
  };

  const handleQcmImageQuestionChange = (value, index) => {
    const newArray = [...markerQcmImageArray];
    newArray[index].question = value;
    setMarkerQcmImageArray(newArray);
  };

  const handleQcmImageAnswerChange = async (
    event,
    questionIndex,
    answerIndex
  ) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        // Afficher un message d'erreur si la taille du fichier dépasse 5 Mo
        DialogBox({
          text: t("fileSizeError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      LoadingBox({
        text: t("loadingAdd"),
        icon: "info",
      });

      try {
        await uploadFileToGithub(file, marker.id, GITHUB_REPO_IMAGES);
        // Le fichier a été téléchargé avec succès
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result;
          const newArray = [...markerQcmImageArray];
          newArray[questionIndex].answersArray[answerIndex] = newImage;
          setMarkerQcmImageArray(newArray);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour de l'image:",
          error
        );
      } finally {
        // Fermer le loading box
        closeLoadingBox();
      }
    }
  };

  const handleQcmImageTitleChange = (value, questionIndex, titleIndex) => {
    const newArray = [...markerQcmImageArray];
    newArray[questionIndex].answersTitleArray[titleIndex] = value;
    setMarkerQcmImageArray(newArray);
  };

  const handleQcmImageSuccessMessageChange = (value, index) => {
    const newArray = [...markerQcmImageArray];
    newArray[index].successMessage = value;
    setMarkerQcmImageArray(newArray);
  };

  const handleQcmImageErrorMessageChange = (value, index) => {
    const newArray = [...markerQcmImageArray];
    newArray[index].errorMessage = value;
    setMarkerQcmImageArray(newArray);
  };

  const handleQcmImagecorrectAnswersChange = (
    event,
    questionIndex,
    answerIndex
  ) => {
    const newArray = [...markerQcmImageArray];
    const correctAnswers = newArray[questionIndex].correctAnswers || [];
    if (event.target.checked) {
      // Add answer index to correctAnswers
      newArray[questionIndex].correctAnswers = [...correctAnswers, answerIndex];
    } else {
      // Remove answer index from correctAnswers
      newArray[questionIndex].correctAnswers = correctAnswers.filter(
        (index) => index !== answerIndex
      );
    }
    setMarkerQcmImageArray(newArray);
  };

  const addQcmImage = (event) => {
    event.preventDefault();
    if (completedQuestionForm("QcmImageMarkerForm")) {
      setMarkerQcmImageArray([
        ...markerQcmImageArray,
        {
          question: DEFAULT_EMPTY_TEXT,
          answersArray: [DEFAULT_EMPTY_TEXT, DEFAULT_EMPTY_TEXT],
          answersTitleArray: [DEFAULT_EMPTY_TEXT, DEFAULT_EMPTY_TEXT],
          correctAnswers: [],
          successMessage: DEFAULT_EMPTY_TEXT,
          errorMessage: DEFAULT_EMPTY_TEXT,
        },
      ]);
    }
  };

  return (
    <>
      <button
        className="buttonModifMarker mt-2 w-100 p-2 "
        onClick={(event) => addQuestion(event)}
      >
        {t("addQuestion")}
      </button>
      <button
        className="buttonModifMarker mt-2 w-100 p-2 "
        onClick={(event) => addQcmQuestion(event)}
      >
        {t("addQCM")}
      </button>
      <button
        className="buttonModifMarker mt-2 w-100 p-2 "
        onClick={(event) => addQcmImage(event)}
      >
        {t("addQcmImage")}
      </button>
      {markerOpenQuestion.map((item, index) => (
        <div className="cardOpenQuestion" key={index}>
          <OpenQuestionMarkerForm
            question={item.question}
            answer={item.answer}
            successMessage={item.successMessage}
            errorMessage={item.errorMessage}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            handleQuestionChange={(event) => handleQuestionChange(event, index)}
            handleAnswerChange={(event) => handleAnswerChange(event, index)}
            handleSuccessMessageChange={(event) =>
              handleSuccessMessageChange(event, index)
            }
            handleErrorMessageChange={(event) =>
              handleErrorMessageChange(event, index)
            }
            index={index}
          />
          <button
            type="button"
            className="buttonDeleteQuiz mt-3 mb-3 me-2"
            onClick={handleDeleteQuestion(index, OPEN_QUESTION)}
            aria-label="delete"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
      {markerQcmArray.map((item, index) => (
        <div className="cardQcm" key={index}>
          <QcmMarkerForm
            question={item.question}
            answersArray={item.answersArray}
            correctAnswers={item.correctAnswers}
            successMessage={item.successMessage}
            errorMessage={item.errorMessage}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            handleQuestionChange={(event) =>
              handleQcmQuestionChange(event, index)
            }
            handleAnswerChange={(event, answerIndex) =>
              handleQcmAnswerChange(event, index, answerIndex)
            }
            handleCorrectAnswerChange={(event, answerIndex) =>
              handlecorrectAnswersChange(event, index, answerIndex)
            }
            handleSuccessMessageChange={(event) =>
              handleQcmSuccessMessageChange(event, index)
            }
            handleErrorMessageChange={(event) =>
              handleQcmErrorMessageChange(event, index)
            }
            handleAddAnswer={(event) => handleAddAnswer(event, index)}
            index={index}
          />
          <button
            type="button"
            className="buttonDeleteQuiz mt-3 mb-3 me-2"
            onClick={handleDeleteQuestion(index, QCM)}
            aria-label="delete"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}

      {markerQcmImageArray.map((item, index) => (
        <div className="cardQcmImage" key={index}>
          <QcmImageMarkerForm
            question={item.question}
            answersArray={item.answersArray}
            answersTitleArray={item.answersTitleArray}
            correctAnswers={item.correctAnswers}
            successMessage={item.successMessage}
            errorMessage={item.errorMessage}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            handleQuestionChange={(event) =>
              handleQcmImageQuestionChange(event, index)
            }
            handleAnswerChange={(event, answerIndex) =>
              handleQcmImageAnswerChange(event, index, answerIndex)
            }
            handleQcmImageTitleChange={(event, titleIndex) =>
              handleQcmImageTitleChange(event, index, titleIndex)
            }
            handleCorrectAnswerChange={(event, answerIndex) =>
              handleQcmImagecorrectAnswersChange(event, index, answerIndex)
            }
            handleSuccessMessageChange={(event) =>
              handleQcmImageSuccessMessageChange(event, index)
            }
            handleErrorMessageChange={(event) =>
              handleQcmImageErrorMessageChange(event, index)
            }
            handleAddAnswer={(event) => handleAddImageAnswer(event, index)}
            index={index}
          />
          <button
            type="button"
            className="buttonDeleteQuiz mt-3 mb-3 me-2"
            onClick={handleDeleteQuestion(index, QCM_IMAGE)}
            aria-label="delete"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
    </>
  );
};

export default QuizMarkerForm;
