import React, { useState, useEffect } from "react";
import { map } from "lodash";
import { withRouter } from "react-router-dom";
import alertErrors from "../../utils/AlertErrors";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import SongsSlider from "../../components/Sliders/SongsSlider";
import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match, playerSong } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .doc(match?.params?.id)
      .get()
      .then((r) => {
        const data = r.data();
        data.id = r.id;
        setArtist(data);
      })
      .catch((err) => alertErrors(err?.code));
  }, [match]);

  useEffect(() => {
    if (artist) {
      db.collection("albums")
        .where("artist", "==", artist.id)
        .get()
        .then((r) => {
          const tempArray = [];
          map(r?.docs, (alb) => {
            const data = alb.data();
            data.id = alb.id;
            tempArray.push(data);
          });
          setAlbums(tempArray);
        })
        .catch((err) => alertErrors(err?.code));
    }
  }, [artist]);

  useEffect(() => {
    const arraySongs = [];
    (async () => {
      await Promise.all(
        map(albums, async (alb) => {
          await db
            .collection("songs")
            .where("album", "==", alb.id)
            .get()
            .then((r) => {
              map(r.docs, (s) => {
                const data = s.data();
                data.id = s.id;
                arraySongs.push(data);
              });
            })
            .catch((err) => alertErrors(err?.code));
        })
      );
      console.log(arraySongs);

      setSongs(arraySongs);
    })();
  }, [albums]);
  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Álbumes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSlider title="Canciónes" data={songs} playerSong={playerSong} />
      </div>
    </div>
  );
}

export default withRouter(Artist);
