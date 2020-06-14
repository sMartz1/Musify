import React, { useState, useEffect } from "react";
import firebase from "../../../utils/firebase";
import "firebase/storage";

import "./BannerArtist.scss";
import alertErrors from "../../../utils/AlertErrors";
export default function BannerArtist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`artist/${artist?.banner}`)
      .getDownloadURL()
      .then((d) => {
        setBannerUrl(d);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);
  return (
    <div
      className="banner-artist"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div className="banner-artist__gradient" />
      <div className="banner-artist__info">
        <h4>Artista</h4>
        <h1>{artist.name}</h1>
      </div>
    </div>
  );
}
