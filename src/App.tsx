import React, { useState, useEffect } from 'react';
import './App.css';
import "cropperjs/dist/cropper.min.css";
import Cropper from 'cropperjs';

function App() {
  const [file, setFile] = useState("");
  const handleOnFileUpload = ({target: {
    files
  }}: React.ChangeEvent<HTMLInputElement>) => {
    if (files) {
      setFile(URL.createObjectURL(files[0]))
  }
}

const handleMove = () => {
  const cropper = new Cropper(document.getElementById("editingImage") as HTMLImageElement);
  cropper.setDragMode("move")
}
  
  return (
    <div className="App">
      <div className="header">
        <span className="title">Photo Editor</span>
      </div>
      <main className="main">
        <div className="loader">
          <p>
            Browse image: <input type="file" onChange={handleOnFileUpload}/>
          </p>
          <div className="imageEditorContainer">
            <img className="editingImage" id="editingImage" src={file}/>
            <div 
              className="toolbar">
                <button id="move" onClick={handleMove} title="Move (M)" className="toolbar__button"><span className="fa fa-arrows">Move&amp;Crop</span></button> 
                <button id="rotate-left" title="Rotate Left (L)" className="toolbar__button"><span className="fa fa-rotate-left">Rotate Left</span></button> 
                <button id="rotate-right" title="Rotate Right (R)" className="toolbar__button"><span className="fa fa-rotate-right">Rotate Right</span></button> 
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
