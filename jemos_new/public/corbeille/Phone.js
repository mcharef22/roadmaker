/*import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Indice from "./screens/Indice";
import Resources from "./screens/Resources";
import Quiz from "./screens/Quiz";
import axios from "axios";
import { useEffect, useState } from "react";

const App = ({ projectId,typeC }) => {
  //récupérer les données du projet
  console.log(typeC)
  const [projectDatas, setProjectDatas] = useState(null);
  useEffect(() => {
    const fetchProjectDatas = async () => {
      const reponse = await axios.get(
        `http://localhost:5000/project/` + projectId
      );
      setProjectDatas(reponse.data);
    };
    fetchProjectDatas();
  }, [projectId]);

  //console.log("phone component ", projectDatas);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Indice projectDatas={projectDatas} />} />
        <Route path="/Resources" element={<Resources />} />
        <Route path="/Quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;*/
