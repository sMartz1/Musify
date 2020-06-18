import React, { useState, useCallback, useEffect } from "react";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import alertErrors from "../../../utils/AlertErrors";
import { map } from "lodash";
import { v4 as uuidGenerator } from "uuid";
import firebase from "../../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";
import noAvatar from "../../../assets/no-image.png";

import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

export default function AddAlbumForm(props) {
  const { setShowModal } = props;

  const [formData, setFormData] = useState(initialValueForm());
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [albumAvatar, setAlbumAvatar] = useState(null);
  const [albumOptions, setAlbumOptions] = useState(null);

  useEffect(() => {
    const tempArray = [];
    db.collection("artists")
      .get()
      .then((r) => {
        map(r?.docs, (m) => {
          const data = { key: m.id, value: m.id, text: m.data().name };
          tempArray.push(data);
        });
        setAlbumOptions(tempArray);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);

  const uploadImage = (nameF) => {
    const ref = firebase.storage().ref().child(`album/${nameF}`);
    return ref.put(file);
  };
  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
    setAlbumAvatar(URL.createObjectURL(file));
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    noKeyboard: true,
    onDrop,
  });

  const onSubmit = () => {
    if (!formData.name || !formData.artist) {
      toast.warning("El nombre del album y el artista son obligatorios");
    } else if (!file) {
      toast.warning("Añade una imagen para el album");
    } else {
      setIsLoading(true);
      const fileName = uuidGenerator();
      uploadImage(fileName)
        .then(() => {
          db.collection("albums")
            .add({
              name: formData.name,
              artist: formData.artist,
              banner: fileName,
            })
            .then(() => {
              toast.success("Se ha subido el nuevo album correctamente.");
              resetForm();

              setIsLoading(false);
              setShowModal(false);
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
    setFormData(initialValueForm());
    setFile(null);
    setAlbumAvatar(null);
  };
  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            className="avatar"
            style={{
              backgroundImage: `url('${albumAvatar}')`,
            }}
          >
            <input {...getInputProps()} />
            {!albumAvatar && <Image src={noAvatar} />}
          </div>
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeholder="Nombre del album"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Dropdown
            placeholder="El album pertenece..."
            fluid
            search
            selection
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
            options={albumOptions}
            lazyLoad
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Crear album
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}
