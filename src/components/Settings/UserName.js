import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../utils/firebase";
import "firebase/auth";

export default function UserName(props) {
  const {
    user,
    setShowModal,
    setTitleModal,
    setContentModal,
    setReloadApp,
  } = props;

  const onEdit = () => {
    setTitleModal("Title");
    setContentModal(
      <ChangeDisplayNameForm
        setShowModal={setShowModal}
        displayName={user.displayName}
        setReloadApp={setReloadApp}
      />
    );
    setShowModal(true);
  };
  return (
    <div className="user-name">
      <h2>{user.displayName}</h2>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeDisplayNameForm(props) {
  const { displayName, setShowModal, setReloadApp } = props;
  const [formData, setFormData] = useState({ displayName: displayName });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    let formOk = true;

    if (formData.displayName.length === 0) {
      toast.warning("El campo no puede estar vacio");
      formOk = false;
    }
    if (formData.displayName === displayName) {
      toast.warning("Debes poner un nombre diferente");
      formOk = false;
    }

    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: formData.displayName,
        })
        .catch(() => {
          toast.error("Error al asignar nombre de usuario");
          formOk = false;
        })
        .finally(() => {
          setIsLoading(false);
          formOk && setShowModal(false);
          setReloadApp((prevState) => !prevState);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={displayName}
          onChange={(e) => setFormData({ displayName: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar nombre
      </Button>
    </Form>
  );
}
