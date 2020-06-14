import React, { useState } from "react";
import { Button, Icon, Form, Input, FormField } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/firebase";
import alertErrors from "../../../utils/AlertErrors";
import "firebase/auth";
import "./LoginForm.scss";

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState(defaultFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = true;
    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }
    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }
    setFormError(errors);
    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((r) => {
          setUser(r.user);
          setUserActive(r.user.emailVerified);
          if (!r.user.emailVerified) {
            toast.warning("Para iniciar sesion debes verificar tu email");
          }
        })
        .catch((err) => {
          alertErrors(err?.code);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-form">
      <h1>Musica para todos.</h1>

      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, introduce un email valido.
            </span>
          )}
        </Form.Field>

        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
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
            error={formError.email}
          />
          {formError.password && (
            <span className="error-text">
              La contraseña tiene un minimo de 5 caracteres.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Iniciar Sesión
        </Button>
      </Form>

      {!userActive && (
        <ButtonResetSendEmailVerification
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}
      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿No tienes cuenta?{""}
          <span onClick={() => setSelectedForm("register")}>Registrate</span>
        </p>
      </div>
    </div>
  );
}
const defaultFormData = () => {
  return {
    email: "",
    password: "",
  };
};

function ButtonResetSendEmailVerification(props) {
  const { user, setIsLoading, setUserActive } = props;

  const resendVerificationEmail = () => {
    user
      .sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado el email de verificacion");
      })
      .catch((err) => {
        alertErrors(err?.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
      });
  };
  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificacion puedes volver a enviarlo
        haciendo click <span onClick={resendVerificationEmail}>aquí.</span>
      </p>
    </div>
  );
}
