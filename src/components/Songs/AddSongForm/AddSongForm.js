import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import firebase from "../../../utils/firebase";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { map } from "lodash";
import alertErrors from "../../../utils/AlertErrors";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialValueForm);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((r) => {
        const tempArray = [];
        map(r.docs, (alb) => {
          const data = { key: alb.id, value: alb.id, text: alb.data().name };

          tempArray.push(data);
        });
        setAlbums(tempArray);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
  });

  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`);
    return ref.put(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const resetForm = () => {
    setFile(null);
    setFormData(initialValueForm);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning(
        "El nombre de la canción y el álbum al que pertenecen son obligatorios"
      );
    } else if (!file) {
      toast.warning("Es necesario subir una canción");
    } else {
      setIsLoading(true);
      const fileName = uuid();
      uploadSong(fileName)
        .then((r) => {
          db.collection("songs").add({
            name: formData.name,
            album: formData.album,
            fileName: fileName,
          });
        })
        .then((r2) => {
          toast.success("Se ha subido la cancion correctamente");
          resetForm();
          setIsLoading(false);
          setShowModal(false);
        })
        .catch((err) => alertErrors(err?.code))
        .catch((err) => {
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };
  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la cancion"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Asigna la cancion a un album"
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra ti cancíon o haz click <span>aquí</span>
            </p>
            {file && (
              <p>
                Canción subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir cancion
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return { name: "", album: "" };
}
