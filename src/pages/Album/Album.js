import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";
import { map } from "lodash";

import ListSongs from "../../components/Songs/ListSongs";

const db = firebase.firestore(firebase);

function Album(props) {
  const { match, playerSong } = props;
  const [album, setAlbum] = useState(null);
  const [albumImg, setAlbumImg] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (album) {
      firebase
        .storage()
        .ref(`album/${album?.banner}`)
        .getDownloadURL()
        .then((r) => {
          setAlbumImg(r);
        })
        .catch((err) => alertErrors(err?.code));
    }
  }, [album]);

  useEffect(() => {
    db.collection("albums")
      .doc(match?.params?.id)
      .get()
      .then((r) => {
        const data = r.data();
        data.id = r.id;
        setAlbum(data);
      })
      .catch((err) => alertErrors(err?.code));
  }, [match]);

  useEffect(() => {
    if (album) {
      db.collection("artists")
        .doc(album?.artist)
        .get()
        .then((r) => {
          const data = r.data();
          data.id = r.id;
          setArtist(data);
        })
        .catch((err) => alertErrors(err?.code));
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("songs")
        .where("album", "==", album.id)
        .get()
        .then((r) => {
          const arraySongs = [];
          map(r.docs, (s) => {
            const data = s.data();
            data.id = s.id;
            arraySongs.push(data);
          });
          setSongs(arraySongs);
        })
        .catch((err) => alertErrors(err?.code));
    }
  }, [album]);
  if (!album || !artist) {
    return <Loader active>Cargando...</Loader>;
  }
  return (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum album={album} albumImg={albumImg} artist={artist} />
      </div>
      <div className="album__songs">
        <ListSongs
          songs={songs}
          albumImage={albumImg}
          playerSong={playerSong}
        />
      </div>
    </div>
  );
}

export default withRouter(Album);

function HeaderAlbum(props) {
  const { album, albumImg, artist } = props;

  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url('${albumImg}')` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          De{" "}
          <Link to={`/artist/${artist.id}`} className="info__artist">
            {artist.name}
          </Link>
        </p>
      </div>
    </>
  );
}
