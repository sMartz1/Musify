import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../../utils/firebase";
import alertErrors from "../../utils/AlertErrors";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import "firebase/firestore";
import "firebase/storage";

import "./Albums.scss";

const db = firebase.firestore(firebase);

export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((d) => {
        const arrayAlbums = [];
        map(d?.docs, (album) => {
          const data = album.data();
          data.id = album.id;
          arrayAlbums.push(data);
        });
        setAlbums(arrayAlbums);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);
  return (
    <div className="albums">
      <h1>Albumes</h1>
      <Grid>
        {map(albums, (album) => {
          return (
            <Grid.Column key={album.id} mobile={8} tablet={4} computer={3}>
              <Album album={album} />
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
}

function Album(props) {
  const { album } = props;

  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBannerUrl(url);
      })
      .catch((err) => alertErrors(err?.code));
  }, [album]);
  return (
    <Link to={`/album/${album.id}`}>
      <div className="albums__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${bannerUrl}')` }}
        />
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}
