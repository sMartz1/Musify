import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import alertErrors from "../../utils/AlertErrors";
import BannerArtist from "../../components/Artists/BannerArtist";
import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [artist, setArtist] = useState(null);
  useEffect(() => {
    db.collection("artists")
      .doc(match?.params?.id)
      .get()
      .then((r) => {
        setArtist(r.data());
      })
      .catch((err) => alertErrors(err?.code));
  }, [match]);
  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}

      <h2>Mas informacion...</h2>
    </div>
  );
}

export default withRouter(Artist);
