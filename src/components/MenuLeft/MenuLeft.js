import React, { useState, useEffect } from "react";

import "./MenuLeft.scss";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { isUserAdmin } from "../../utils/Api";
import AddArtistForm from "../Artists/AddArtistForm";
import AddAlbumForm from "../Albums/AddAlbumForm";
import AddSongForm from "../Songs/AddSongForm";

import BasicModal from "../Modal/BasicModal";




function MenuLeft(props) {
  const { user, location } = props;
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const electron = window.require('electron')

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handlerMenu = (e, menu) => {
    setActiveMenu(menu.to);
  };



  const handlerModal = (type) => {
    switch (type) {
      case "artist":
        setTitleModal("Nuevo artista");
        setContentModal(<AddArtistForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;
      case "album":
        setTitleModal("Nuevo album");
        setContentModal(<AddAlbumForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;
      case "song":
        setTitleModal("Nueva canción");
        setContentModal(<AddSongForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;

      default:
        setTitleModal(null);
        setContentModal(null);
        setShowModal(false);
        break;
    }
  };

  useEffect(() => {
    isUserAdmin(user.uid).then((r) => {
      
      
      setUserAdmin(r);
    });
  }, [user]);

  const closeApp = ()=>{
    electron.remote.getCurrentWindow().close();
  }

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
        <Menu.Item
            
            name="home"
            
            onClick={closeApp}
          >
            <Icon name="close" /> Cerrar
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/"
            name="home"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Inicio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            name="artists"
            active={activeMenu === "/artists"}
            onClick={handlerMenu}
          >
            <Icon name="user" /> Artistas
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/albums"
            name="albums"
            active={activeMenu === "/albums"}
            onClick={handlerMenu}
          >
            <Icon name="window maximize outline" /> Albumes
          </Menu.Item>
        </div>
        {userAdmin && (
          <div className="footer">
            <Menu.Item onClick={() => handlerModal("song")}>
              <Icon name="plus square outline" />
              Nueva Canción
            </Menu.Item>
            <Menu.Item onClick={() => handlerModal("album")}>
              <Icon name="plus square outline" />
              Nuevo Album
            </Menu.Item>
            <Menu.Item onClick={() => handlerModal("artist")}>
              <Icon name="plus square outline" />
              Nuevo Artista
            </Menu.Item>
          </div>
        )}
      </Menu>
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default withRouter(MenuLeft);
