import React, { useState } from "react";
import { Icon, Image, Button } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../utils/firebase";
import "firebase/auth";
import UserImage from "../../assets/user.png";

import BasicModal from "../Modal/BasicModal";

import "./TopBar.scss";

function TopBar(props) {
  const { user, history } = props;
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  const handleModal = (type) => {
    switch (type) {
      case "signOut":
        setTitleModal("Cerrar sesión");
        setContentModal(
          <>
            <Button
              inverted
              color="red"
              onClick={logout}
              className="modal-logout-button"
            >
              Logout
            </Button>
          </>
        );
        setShowModal(true);
        break;

      default:
        break;
    }
  };
  const goBack = () => {
    history.goBack();
  };
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  };
  return (
    <>
      <div className="top-bar">
        <div className="top-bar__left">
          <Icon name="angle left" onClick={goBack} />
        </div>
        <div className="top-bar__right">
          <Link to="/settings">
            <Image src={user.photoURL ? user.photoURL : UserImage} />
            {user.displayName}
          </Link>
          <Icon name="power off" onClick={() => handleModal("signOut")} />
        </div>
      </div>
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default withRouter(TopBar);
