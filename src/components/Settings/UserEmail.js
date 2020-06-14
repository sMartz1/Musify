import React, { useState } from "react";
import { Form, Input, Button, Icon } from "semantic-ui-react";
import firebase from "../../utils/firebase";
import { validateEmail } from "../../utils/Validations";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import "firebase/auth";
import { toast } from "react-toastify";

export default function UserEmail(props) {
  const { user, setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Cambiar de correo electronico");
    setContentModal(
      <ChangeDisplayEmailForm
        setShowModal={setShowModal}
        userEmail={user.email}
      />
    );
    setShowModal(true);
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeDisplayEmailForm(props) {
  const { userEmail, setShowModal } = props;
  const [formData, setFormData] = useState({ email: userEmail, password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = () => {
    let formOk = true;
    console.log(FormData.email);
    if (!validateEmail(formData.email)) {
      formOk = false;
      toast.warning("El correo no es valido");
    }
    if (formData.email === userEmail) {
      formOk = false;
      toast.warning("Debes introducir un correo diferente");
    }

    if (formOk) {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updateEmail(formData.email)
            .then(() => {
              toast.success("Email actualizado");
              setIsLoading(false);
              setShowModal(false);
              currentUser.sendEmailVerification().then(() => {
                firebase.auth().signOut();
              });
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

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={userEmail}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Contraseña"
          type={showPassword ? "text" : "password"}
          icon={
            showPassword ? (
              <Icon
                name="eye slash outline"
                link
                onClick={handleShowPassword}
              />
            ) : (
              <Icon name="eye" link onClick={handleShowPassword} />
            )
          }
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar email
      </Button>
    </Form>
  );
}
