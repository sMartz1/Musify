import { toast } from "react-toastify";

export default function alertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("El usuario o la contraseña son incorrectos");
      break;
    case "auth/user-not-found":
      toast.warning("El usuario o la contraseña son incorrectos");
      break;
    case "auth/too-many-request":
      toast.warning(
        "Has enviado demasiadas solicitudes de envio de email de confirmacion en muy poco tiempo"
      );
      break;
    case "auth/email-already-in-use":
      toast.warning("El email ya esta en uso");
      break;
    default:
      toast.warning("Error del servidor");
      console.log(type);

      break;
  }
}
