import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/firebase";
import "firebase/auth";

export default function UserPassword(props) {
  const { setShowModal, setTitleModal, setContentModal } = props;
  const onEdit = () => {
    setTitleModal("Cambio de contraseña");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };
  return (
    <div className="user-password">
      <h3>Contraseña: ********</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangePasswordForm(props) {
  const { setShowModal } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      toast.warning("Los campos no pueden estar vacios");
    } else if (formData.currentPassword === formData.newPassword) {
      toast.warning("La nueva contraseña no puede ser igual a la actual");
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      toast.warning("Las contraseñas no coinciden");
    } else if (formData.newPassword.length < 6) {
      toast.warning("La contraseña debe de tener mas de 5 caracteres");
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPassword)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updatePassword(formData.newPassword)
            .then(() => {
              toast.success("Se ha cambiado la contraseña correctamente");
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
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
          placeholder="Contraseña actual"
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
            setFormData({ ...formData, currentPassword: e.target.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nueva contraseña"
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
            setFormData({ ...formData, newPassword: e.target.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Repetir nueva contraseña"
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
            setFormData({ ...formData, repeatNewPassword: e.target.value })
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar contraseña
      </Button>
    </Form>
  );
}
