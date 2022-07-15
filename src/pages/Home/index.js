import React, { useState, useRef, createRef, useEffect } from "react";
import {
  Alert,
  Grid,
  Box,
  FormControl,
  IconButton,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";

import ShapesProperties from "../../Components/ShapesProperties";
import { useContextApi } from "../../lib/hooks/useContexApi";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import Collapse from "@mui/material/Collapse";
import BrushIcon from "@mui/icons-material/Brush";

import { Stage, Layer } from "react-konva";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CropSquareOutlinedIcon from "@mui/icons-material/CropSquareOutlined";
import AutoFixNormalOutlinedIcon from "@mui/icons-material/AutoFixNormalOutlined";
import DrawCircle from "../../Components/Drawer/DrawCirlcle";
import { PencilDraw } from "../../Components/Drawer/PencilDraw";
import DrawRectangle from "../../Components/Drawer/DrawRectangle";
import ImgPicker from "../../Components/ImagePicker";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { addTextNode } from "../../Components/Drawer/addTextNode";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextDraw from "../../Components/Drawer/TextDraw";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const {
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
    selectedShape,
    setSelectedShape,
    bgColorLayer,
  } = useContextApi();

  const printComponentRef = useRef();

  const [undoShapes, setUndoShapes] = useState([]);
  const [redoShapes, setRedoShapes] = useState([]);
  const [deleteShapeId, setDeleteShapId] = useState(null);

  const theme = useTheme();
  const isCloseDrawer = useMediaQuery(theme.breakpoints.down("sm"));

  const stageEl = createRef();
  const layerEl = createRef();
  const fileUploadEl = createRef();

  const drawImage = () => {
    fileUploadEl.current.click();
  };

  const addImage = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        const generateId = Date.now() + "";
        const imageProperties = {
          content: reader.result,
          id: generateId,
          name: "image",
        };
        setImages([...images, imageProperties]);
        setUndoShapes([...undoShapes, imageProperties]);
        fileUploadEl.current.value = null;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const addText = () => {
    const textId = Date.now() + "";
    const textProperties = {
      name: "text",
      x: getRandomInt(100),
      y: getRandomInt(100),
      fontSize: 20,
      id: textId,
      color: "#000",
      text: "hello worlds",
      wrap: "char",
      align: "center",
    };
    setTextDraw([...textDraw, textProperties]);
    setUndoShapes([...undoShapes, textProperties]);
  };

  const addRectangle = () => {
    const shapeId = Date.now() + "";
    const rectangleProperties = {
      name: "rectangle",
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "transparent",
      id: shapeId,
      color: "#000",
    };
    setRectangles([...rectangles, rectangleProperties]);
    setUndoShapes([...undoShapes, rectangleProperties]);
  };

  const addCircle = () => {
    const shapeId = Date.now() + "";
    const circelProperties = {
      name: "circle",
      x: getRandomInt(100),
      y: getRandomInt(100),
      width: 100,
      height: 100,
      fill: "transparent",
      id: shapeId,
      color: "#000",
    };
    setCircles([...circles, circelProperties]);
    setUndoShapes([...undoShapes, circelProperties]);
  };

  const drawLine = ({ isStright }) => {
    PencilDraw({
      name: "pencil",
      stage: stageEl.current.getStage(),
      layer: layerEl.current,
      color: "#000",
      mode: "brush",
      stright: isStright,
    });
  };

  const eraserLine = () => {
    PencilDraw({
      stage: stageEl.current.getStage(),
      layer: layerEl.current,
      color: "#000",
      mode: "erase",
    });
  };

  const handleSelectDropDownShape = (event) => {
    switch (event.target.value) {
      case "square":
        addRectangle();
        break;
      case "circle":
        addCircle();
        break;
      case "pencil":
        drawLine({ isStright: false });
        break;
      case "stright":
        drawLine({ isStright: true });
        break;
      case "eraser":
        eraserLine();
        break;
      default:
        break;
    }
  };

  const handleSelectLineDropDown = (event) => {
    switch (event.target.value) {
      case "pencil":
        drawLine({ isStright: false });
        break;
      case "stright":
        drawLine({ isStright: true });
        break;
      case "eraser":
        eraserLine();
        break;
      default:
        break;
    }
  };

  const drawText = () => {
    const id = addTextNode(stageEl.current.getStage(), layerEl.current);
  };

  const undo = () => {
    if (undoShapes.length === 0) return;
    const previousShape = undoShapes.pop();
    switch (previousShape.name) {
      case "rectangle":
        const newRect = rectangles.filter(
          (rect) => rect.id !== previousShape.id
        );
        setRectangles(newRect);
        setRedoShapes([...redoShapes, rectangles[rectangles.length - 1]]);
        break;
      case "circle":
        const newCircle = circles.filter(
          (circle) => circle.id !== previousShape.id
        );
        setCircles(newCircle);
        setRedoShapes([...redoShapes, circles[circles.length - 1]]);
        break;
      case "image":
        const newImage = images.filter((img) => img.id !== previousShape.id);
        setImages(newImage);
        setRedoShapes([...redoShapes, images[images.length - 1]]);
        break;
      default:
        break;
    }
  };

  const redo = () => {
    if (redoShapes.length === 0) return;
    const previousShape = redoShapes.pop();
    switch (previousShape.name) {
      case "rectangle":
        setRectangles([...rectangles, previousShape]);
        break;
      case "circle":
        setCircles([...circles, previousShape]);
        break;
      case "image":
        setImages([...images, previousShape]);
        break;
      default:
        break;
    }
    setUndoShapes([...undoShapes, previousShape]);
  };

  const handleSelecShape = (shape) => {
    setSelectedShape(shape);
  };

  const saveShapeToDataBase = () => {
    // const newLayout = [];
    // const newProperties = {
    //   shapes: {
    //     rectangles: rectangles,
    //     circles: circles,
    //     images: images,
    //   },
    // };
    // newLayout[selecIndexOfLayout] = newProperties;
    // const path = `users/${userId}/layouts`;
    // writeDataBase(path, newLayout);
  };

  const saveShapes = () => {
    saveShapeToDataBase();
    setIsDisplayAlert({
      isError: true,
      message: "berhasil disimpan",
      type: "success",
    });
    setTimeout(
      () => setIsDisplayAlert({ isError: false, message: "", type: "error" }),
      2000
    );
  };

  // delete shape on key press
  useEffect(() => {
    const handleDeleteShape = (e) => {
      if (e.key === "Backspace") {
        const result = JSON.parse(localStorage.getItem("@shape_key"));
        if (result === null) return;
        switch (result.name) {
          case "rectangle":
            const newRectangle = rectangles.filter(
              (rect) => parseInt(rect.id) !== parseInt(result.id)
            );
            if (newRectangle.length !== 0) {
              setRectangles(newRectangle);
            }
            break;
          case "circle":
            const newCircle = circles.filter(
              (circle) => parseInt(circle.id) !== parseInt(result.id)
            );
            setCircles(newCircle);
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleDeleteShape);
    return () => window.removeEventListener("keydown", handleDeleteShape);
  }, []);

  return (
    <>
      <Stack
        direction={isCloseDrawer ? "column" : "row"}
        m={1}
        alignItems="center"
        sx={{
          padding: "2px",
          position: isCloseDrawer ? "absolute" : "static",
          zIndex: 2,
        }}
        spacing={1}
      >
        <FormControl>
          <Select
            value={""}
            onChange={handleSelectDropDownShape}
            sx={{ height: "30px" }}
            displayEmpty
            startAdornment={
              <InputAdornment>
                <CropSquareOutlinedIcon />
              </InputAdornment>
            }
            labelId="demo-simple-select-label"
            id="demo-simple-select-label"
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"square"}>
              <ListItem>
                <CropSquareOutlinedIcon />
                <ListItemText>Square</ListItemText>
              </ListItem>
            </MenuItem>
            <MenuItem value={"circle"}>
              <ListItem>
                <CircleOutlinedIcon />
                <ListItemText>Circle</ListItemText>
              </ListItem>
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <Select
            value={""}
            onChange={handleSelectLineDropDown}
            sx={{ height: "30px", ml: 1 }}
            displayEmpty
            startAdornment={
              <InputAdornment>
                <BorderColorRoundedIcon />
              </InputAdornment>
            }
            labelId="demo-simple-select-label"
            id="demo-simple-select-label"
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"pencil"}>
              <ListItem>
                <BrushIcon />
                <ListItemText>Pencil</ListItemText>
              </ListItem>
            </MenuItem>
            <MenuItem value={"stright"}>
              <ListItem>
                <BorderColorRoundedIcon />
                <ListItemText>Line</ListItemText>
              </ListItem>
            </MenuItem>
            <MenuItem value={"eraser"}>
              <ListItem>
                <AutoFixNormalOutlinedIcon />
                <ListItemText>Eraser</ListItemText>
              </ListItem>
            </MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={drawImage}>
          <InsertPhotoIcon />
        </IconButton>
        <IconButton onClick={addText}>
          <TextFieldsIcon />
        </IconButton>
        <IconButton onClick={undo}>
          <UndoIcon />
        </IconButton>
        <IconButton onClick={redo}>
          <RedoIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={saveShapes}>
          <SaveIcon />
        </IconButton>
      </Stack>

      {/* content */}
      {isCloseDrawer && (
        <Stack direction="row" justifyContent={"flex-end"}>
          <IconButton>
            <MenuIcon />
          </IconButton>
        </Stack>
      )}
      <div ref={printComponentRef}>
        <input
          style={{ display: "none" }}
          type="file"
          ref={fileUploadEl}
          onChange={addImage}
        />

        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageEl}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) {
              handleSelecShape(null);
            }
          }}
          style={{ backgroundColor: bgColorLayer }}
        >
          <Layer ref={layerEl}>
            {textDraw.map((text, index) => {
              return (
                <TextDraw
                  key={index}
                  textProps={text}
                  isSelected={text.id === selectedShape?.id}
                  onSelect={() => {
                    handleSelecShape(text);
                    setDeleteShapId(text.id);
                  }}
                  onChange={(newAttrs) => {
                    const texts = textDraw.slice();
                    texts[index] = newAttrs;
                    setTextDraw(texts);
                  }}
                />
              );
            })}
            {rectangles.map((rect, index) => {
              return (
                <DrawRectangle
                  strokeColor={rect.color}
                  key={index}
                  shapeProps={rect}
                  isSelected={rect.id === selectedShape?.id}
                  onSelect={() => {
                    handleSelecShape(rect);
                    setDeleteShapId(rect.id);
                    localStorage.setItem("@shape_key", JSON.stringify(rect));
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[index] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}
            {circles.map((circle, index) => {
              return (
                <DrawCircle
                  key={index}
                  strokeColor={circle.color}
                  shapeProps={circle}
                  isSelected={circle.id === selectedShape?.id}
                  onSelect={() => {
                    handleSelecShape(circle);
                  }}
                  onChange={(newAttrs) => {
                    const circs = circles.slice();
                    circs[index] = newAttrs;
                    setCircles(circs);
                  }}
                />
              );
            })}
            {images.map((image, index) => {
              return (
                <ImgPicker
                  key={index}
                  imageUrl={image.content}
                  isSelected={image.id === selectedShape?.id}
                  onSelect={() => {
                    handleSelecShape(image);
                  }}
                  onChange={(newAttrs) => {
                    const imgs = images.slice();
                    imgs[index] = newAttrs;
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* alert messages */}
      <Box sx={{ position: "absolute", bottom: "20px" }}>
        <Collapse in={isDisplayAlert.isError}>
          <Alert severity={isDisplayAlert.type}>{isDisplayAlert.message}</Alert>
        </Collapse>
      </Box>

      {/* right navigations */}
      <ShapesProperties printComponentRef={printComponentRef} />
    </>
  );
};

export default Home;
