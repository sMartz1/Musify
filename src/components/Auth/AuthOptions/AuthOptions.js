import React from "react";
import "./AuthOptions.scss";

import { Button } from "semantic-ui-react";
export default function AuthOptions(props) {
  const { setSelectedForm } = props;
  return (
    <div className="auth-options">
      <h2>Canciones en Musify</h2>
      <Button
        className="register"
        onClick={() => {
          setSelectedForm("register");
        }}
      >
        Registrate gratis
      </Button>
      <Button
        className="login"
        onClick={() => {
          setSelectedForm("login");
        }}
      >
        Iniciar sesión
      </Button>
    </div>
  );
}
