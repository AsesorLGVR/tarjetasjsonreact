import React, { useState, useMemo } from 'react';
import VerticalLayout from '../components/core/layout/VerticalLayout.react';
import Card from '../components/core/UI/Card.react';
import Text from '../components/core/UI/Text.react';
import withDragAndDrop from '../components/hoc/withDragAndDrop.react';
import Button from '../components/core/UI/Button.react';
import Quiz from '../quiz/Quiz.react';
import Spinner from '../components/core/UI/Spinner.react';
import { randomizeArray } from '../service/util/util';
import IconWrapper from '../components/core/UI/IconWrapper.react';
import classes from './Landing.module.css';
import Modal from '../components/core/UI/Modal.react';
import Code from '../components/core/UI/Code.react';

const instructionsText = `[
  {
    "question": "In Java, how many bytes is a long?",
    "options": [
      "4 bytes",
      "8 bytes",
      "16 bytes",
      "32 bytes",
      "64 bytes",
    ],
    "correct": 1
  },
  {
    "question": "True or False: A string is a primitive datatype in Java.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1
  }
]`;

const initialModalState = {showModal: false, modalType: null};

const Landing = () => {
  const [isLoading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [modalState, setModalState] = useState(initialModalState);

  const handleHideModal = () => setModalState(initialModalState);
  const handleShowModal = content => setModalState({show: true, content});
  const handleShowInstructions = () => handleShowModal('instructions');
  const handleShowCredits = () => handleShowModal('credits');

  const handleDrop = async e => {
    if (e.dataTransfer.items) {
      setLoading(true);
      const file = e.dataTransfer.items[0];
      if (file.kind === 'file' && file.type === 'application/json') {
        const fileContents = await file.getAsFile().text();
        const fileData = JSON.parse(fileContents);
        // Error handling should go here
        setQuizData(randomizeArray(fileData));
      }
      setLoading(false);
    }
  };

  const setNewQuizData = data => {
    setQuizData(randomizeArray(data));
  };

  const handleUpload = async e => {
    if (e.target.files) {
      setLoading(true);
      const file = e.target.files[0];
      if (file.type === 'application/json') {
        const fileContents = await file.text();
        const fileData = JSON.parse(fileContents);
        // Error handling should go here
        setQuizData(randomizeArray(fileData));
      }
      setLoading(false);
    }
  };

  const DragAndDropCard = useMemo(() => withDragAndDrop(Card, handleDrop), []);
  const quizEndHandler = () => setQuizData(null);
  const quizRestartHandler = () =>
    setQuizData(currQuizData => randomizeArray(currQuizData));

  return (
    <>
      {!quizData ? (
        <>
         
          <div className={classes.Landing}>
            <VerticalLayout center="horizontal" spaceBetween={1.25}>
              <Text variant="primary" bold type="title">
                Spanish.Immersive
            </Text>
              <Text type="body1">
                Crea tarjetas rápido con archivos json.
            </Text>
              <DragAndDropCard enabled={!isLoading} transparent>
                {!isLoading ? (
                  <VerticalLayout center="middle">
                    <IconWrapper iconSize={3} iconType="drag">
                      <Text type="header2" align="center">
                       Arrastra y suelta tu archivo json aquí
                    </Text>
                    </IconWrapper>
                    <Text type="body1">o</Text>
                    <Button
                      id="fileUpload"
                      type="file"
                      value="Upload"
                      onChange={handleUpload}
                    ></Button>
                  </VerticalLayout>
                ) : (
                    <Spinner text="Subiendo tus tarjetas..." />
                  )}
              </DragAndDropCard>
             
            </VerticalLayout>
            <div className={classes.Credits}>
              
            </div>
          </div>
        </>
      ) : (
          <>
            {!isLoading && (
              <Quiz
                data={quizData}
                setData={setNewQuizData}
                finishQuiz={quizEndHandler}
                restartQuiz={quizRestartHandler}
              />
            )}
          </>
        )}
    </>
  );
};

export default Landing;
