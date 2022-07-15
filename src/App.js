import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContextApi } from "./lib/helper/ContextApi";
import "./App.css";

import Home from "./pages/Home";
import NoPage from "./pages/NoPage404";
import Layout from "./Layout";

function App() {
  const [isDisplayAlert, setIsDisplayAlert] = useState({
    isError: false,
    message: "",
    type: "error",
  });
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [images, setImages] = useState([]);
  const [textDraw, setTextDraw] = useState([]);
  const [zoomShape, setZoomShape] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null);
  const [bgColorLayer, setBgColorLayer] = useState("#f3f3f3");

  return (
    <ContextApi.Provider
      value={{
        isDisplayAlert,
        setIsDisplayAlert,
        rectangles,
        setRectangles,
        circles,
        setCircles,
        images,
        setImages,
        textDraw,
        setTextDraw,
        zoomShape,
        setZoomShape,
        selectedShape,
        setSelectedShape,
        bgColorLayer,
        setBgColorLayer,
      }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ContextApi.Provider>
  );
}

export default App;
