import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/firebase";
import "firebase/firestore";

import "./Album.scss";

const db = firebase.firestore(firebase);

function Album(props) {
  const { match } = props;
  const [album, setAlbum] = useState(null);
  useEffect(() => {
    db.collection("albums")
      .doc(match?.params?.id)
      .get()
      .then((r) => {
        setAlbum(r.data());
      })
      .catch((err) => alertErrors(err?.code));
  }, [match]);
  return (
    <div>
      <h3>Album</h3>
    </div>
  );
}

export default withRouter(Album);
