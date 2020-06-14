import React, { useState, useCallback } from "react";
import "./AddArtistForm.scss";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import noImage from "../../../assets/no-image.png";
import { v4 as uuidGenerator } from "uuid";
import firebase from "../../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";

import { toast } from "react-toastify";
import alertErrors from "../../../utils/AlertErrors";

const db = firebase.firestore(firebase);

export default function AddArtistForm(props) {
  const { setShowModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialValueForm());
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`artist/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name) {
      toast.warning("Añade el nombre del artista");
    } else if (!file) {
      toast.warning("Añade una imagen para el artista");
    } else {
      setIsLoading(true);
      const fileName = uuidGenerator();
      uploadImage(fileName)
        .then(() => {
          db.collection("artists")
            .add({
              name: formData.name,
              banner: fileName,
            })
            .then(() => {
              toast.success("Se ha creado el artista");
              setIsLoading(false);
              setShowModal(false);
              resetForm();
            })
            .catch((err) => {
              alertErrors(err?.code);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };
  const resetForm = () => {
    setFormData(initialValueForm);
    setFile(null);
    setBanner(null);
  };
  return (
    <Form className="add-artist-form" onSubmit={onSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <input {...getInputProps()} />
        {!banner && <Image src={noImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${banner ? banner : noImage}')` }}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nombre del artista"
          onChange={(e) => setFormData({ name: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Crear artista
      </Button>
    </Form>
  );
}
function initialValueForm() {
  return {
    name: "",
  };
}
