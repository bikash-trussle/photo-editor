import React, { useState, useEffect } from 'react';
import './App.css';
import "cropperjs/dist/cropper.min.css";
import Cropper from 'cropperjs';

export const App: React.FC = () => {

    const [originalFile, setOriginalFile] = useState<string>("");
    const [file, setFile] = useState<string>("");
    const [mode, setMode] = useState<string>("crop");
    const [cropper, setCropper] = useState<Cropper | undefined>(undefined);

    const handleOnFileUpload = ({target: {
        files
      }}: React.ChangeEvent<HTMLInputElement>) => {
        if (files && files.length) {
          setFile(URL.createObjectURL(files[0]))
      }
    }


    useEffect(() => {
        if (file !== "") {
            const cropper = new Cropper (document.getElementById("editingImage") as HTMLImageElement, {
                autoCrop: false,
                modal: false,
                background: false
            });
            setCropper(cropper)
        }
        return () => {
            if (file === "") {
                cropper?.destroy();
            }
        };
    }, [file]);

    useEffect(() => {
        switch(mode) {
            case 'rotate-left':
                cropper?.rotate(-90);
                break;
            case 'rotate-right':
                cropper?.rotate(90);
                break;
            case 'reset':
                // cropper?.reset();
                console.log(originalFile)
                setFile(originalFile);
                break;
            case 'apply':
                const url = cropper?.getCroppedCanvas().toDataURL();
                cropper?.destroy()
                setCropper(undefined);
                setFile(url as any);
                break;
            default:
                //do nothing
        }
    }, [mode])

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
            <img alt="Upload here" className="editingImage" id="editingImage" src={file}/>
            <div 
                className="toolbar">
                <button id="move" onClick={() => setMode("crop")} title="Move (M)" className="toolbar__button"><span className="fa fa-arrows">Move&amp;Crop</span></button> 
                <button id="rotate-left" onClick={() => setMode("rotate-left")} title="Rotate Left (L)" className="toolbar__button"><span className="fa fa-rotate-left">Rotate Left</span></button> 
                <button id="rotate-right" onClick={() => setMode("rotate-right")} title="Rotate Right (R)" className="toolbar__button"><span className="fa fa-rotate-right">Rotate Right</span></button> 
                <button id="reset" onClick={() => setMode("reset")}>Reset</button>
                <button id="download" onClick={() => setMode("apply")}>I am pleased!</button>
                </div>
            </div>
        </div>
        </main>
    </div>
  )
}