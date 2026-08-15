
import React, { useState } from "react";
import Picture from "../Picture";
import { useDrop } from "react-dnd";
import Image from "../PaletteBuilder/Image";
import Video from "../PaletteBuilder/Video";
import Link from "../PaletteBuilder/Link";
import Navigation from "../Navigation";
import { Question, Reponse } from "../PaletteBuilder/Question";
import Qcm from "../PaletteBuilder/Qcm";
import { Case, Case2 } from "../PaletteBuilder/Case";
import Camera from "../PaletteBuilder/Camera";
import Audio from "../PaletteBuilder/Audio";
import Titre from "../PaletteBuilder/Titre";
{/*si vous ne comprenez pas quelque chose vous pouvez voir sur Indice.js */ }
const PictureList = [
  {
    id: '1',
    src: 'image.png',
    name: 'Image',
    action: <Image />

  },
  {
    id: '2',
    src: 'zone.png',
    name: 'Titre',
    action: <Titre />,
  },
  {
    id: '3',
    src: 'camera.png',
    name: 'Camera',
    action: <Camera />,
  },
  {
    id: '4',
    src: 'link.png',
    name: 'lien',
    action: <Link />,
  },
  {
    id: '5',
    src: 'volume.png',
    name: 'son',
    action: <Audio />,
  },
  {
    id: '6',
    src: 'question.png',
    name: 'Question',
    action: <div><Question /><Reponse /></div>,
  },
  {
    id: '7',
    src: 'checkbox.png',
    name: 'Case',
    action: <div><Case /><Case2 /></div>,
  },
  {
    id: '8',
    src: 'video.png',
    name: 'video',
    action: <Video />,
  },
  {
    id: '9',
    src: 'qcm.png',
    name: 'Qcm',
    action: <><Qcm /></>,
  },
];

function Quiz() {
  const [board, setBoard] = useState([]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (name) => addImageToBoard(name.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addImageToBoard = (id) => {
    const pictureList = PictureList.filter((picture) => id === picture.id);
    setBoard((board) => [...board, pictureList[0]]);
  };
  return (
    <>
      <div className='row'>
        <div className='col-md-9'>
          <div className='row'>
            <Navigation />
            <div className='col-md-4'></div>
            <div className='col-md-3'>
              <div style={{ width: '330px', height: '600px', border: '22px solid black', borderRadius: '10%', marginTop: '0%' }} ref={drop} >
                <img src="header.png" alt="" width={290} />
                <h3 style={{ backgroundColor: '#d7eed1' }}>Quiz</h3>
                {board.map((picture) => {
                  return (
                    <div>
                      <Picture id={picture.id} name={picture.name} action={picture.action} />
                    </div>);
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='row' style={{ backgroundColor: '#d7eed1', textAlign: 'center' }}>
            <h1>Palette</h1>
          </div>
          <div className='row' style={{ backgroundColor: '#f8f9f3', textAlign: 'center' }}>
            <h4> Composants</h4>
          </div>
          <div className="Picture" style={{ backgroundColor: 'white', width: '100%', columns: '3' }}>
            {PictureList.map((picture) => {
              return <Picture src={picture.src} id={picture.id} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Quiz;
