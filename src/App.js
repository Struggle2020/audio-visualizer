import "./App.css";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";

const App = () => {
  const [file, setFile] = useState("");

  useEffect(() => {
    const audio = new Audio(file);
    if (file) {
      audio.play().then(() => {
        console.log("audio playing");
      });
    }
  }, [file]);
  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles) =>
          setFile(URL.createObjectURL(acceptedFiles[0]))
        }
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      <audio src={file} />
    </>
  );
};

export default App;
