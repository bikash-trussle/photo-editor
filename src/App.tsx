import React, { useState, useEffect } from 'react';
import './App.css';
import "cropperjs/dist/cropper.min.css";
import Cropper from 'cropperjs';
import "font-awesome/css/font-awesome.css";

export const App: React.FC = () => {

    const [originalFile, setOriginalFile] = useState<string>("");
    const [file, setFile] = useState<string>("");
    const [mode, setMode] = useState<string>("crop");
    const [cropper, setCropper] = useState<Cropper | undefined>(undefined);

    const handleOnFileUpload = ({target: {
        files
      }}: React.ChangeEvent<HTMLInputElement>) => {
        if (files && files.length) {
          setOriginalFile(URL.createObjectURL(files[0]));
          setFile(URL.createObjectURL(files[0]))
      }
    }

    const  grayScale = (imgObj: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext){
            throw Error("Cannot create canvas")
        }
         
        const imgW = imgObj.width;
        const imgH = imgObj.height;
        canvas.width = imgW;
        canvas.height = imgH;
         
        canvasContext?.drawImage(imgObj, 0, 0);
        const imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
         
        for(var y = 0; y < imgPixels.height; y++){
            for(var x = 0; x < imgPixels.width; x++){
                var i = (y * 4) * imgPixels.width + x * 4;
                var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg; 
                imgPixels.data[i + 1] = avg; 
                imgPixels.data[i + 2] = avg;
            }
        }
        canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        return canvas.toDataURL();
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
              cropper?.clear();
                cropper?.rotate(-90);
                break;
            case 'rotate-right':
              cropper?.clear();
                cropper?.rotate(90);
                break;
            case 'reset':
                cropper?.reset();
                cropper?.clear();
                cropper?.destroy();
                setCropper(undefined);
                setFile(originalFile);
                break;
            case 'apply':
                const url = cropper?.getCroppedCanvas().toDataURL();
                cropper?.destroy()
                setCropper(undefined);
                setFile(url as any);
                break;
            case 'gray-scale':
                const imageDataUrl = grayScale(document.getElementById("editingImage") as HTMLImageElement);
                cropper?.destroy()
                setCropper(undefined);
                setFile(imageDataUrl as any);
            default:
                //do nothing
        }
    }, [mode])

    const imageEditor = () => {
      if (file) {
        return (
          <div className="imageEditorContainer">
            <img alt="Upload here" className="editingImage" id="editingImage" src={file}/>
                <div className="toolbar">
                    <button id="move" onClick={() => setMode("crop")} title="Move (M)" className="toolbar__button"><span className="fa fa-arrows"></span></button>
                    <button id="grayscale" onClick={() => setMode("gray-scale")} title="Grayscale (M)" className="toolbar__button"><span className="fa fa-camera-retro"></span></button>
                    <button id="rotate-left" onClick={() => setMode("rotate-left")} title="Rotate Left (L)" className="toolbar__button"><span className="fa fa-rotate-left"></span></button>
                    <button id="rotate-right" onClick={() => setMode("rotate-right")} title="Rotate Right (R)" className="toolbar__button"><span className="fa fa-rotate-right"></span></button>
                </div>
            </div>
        )
      }
    }

    const imageEditorNav = ()=> {
      if (file) {
        return(
          <div className="navbar">
            <nav className="nav">
              <button type="button" title="Undo" className="nav-button" onClick={() => setMode("reset")}>
                <span className="fa fa-undo"></span>
              </button>
              <button type="button" title="Done" className="nav-button" onClick={() => setMode("apply")}>
                <span className="fa fa-check"></span>
              </button>
              <a type="button" title="Download" className="nav-button" href={file} download="your-image">
                <span className="fa fa-download"></span>
              </a>
            </nav>
          </div>
        );
      }
    }

    return (
    <div className="App">
        <div className="header">
          <span className="title">Photo Editor</span>
          {imageEditorNav()}
        </div>
        <main className="main">
        <div className="loader">
            <p>
              Upload image: <input type="file" onChange={handleOnFileUpload}/>
            </p>
            {imageEditor()}
        </div>
        </main>
    </div>
  )
}