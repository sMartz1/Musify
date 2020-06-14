import React, { useEffect, useState } from "react";
import firebase from "../../utils/firebase";
import alertErrors from "../../utils/AlertErrors";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import "firebase/firestore";

import "./Artists.scss";

const db = firebase.firestore(firebase);

export default function Artists() {
  const [artists, setArtists] = useState([]);

  // useEffect(() => {
  //   db.collection("artists")
  //     .get()
  //     .then((d) => {
  //       const arrayArtist = [];
  //       map(d?.docs, (artist) => {
  //         const data = artist.data();
  //         data.id = artist.id;
  //         arrayArtist.push(data);
  //       });
  //       setArtists(arrayArtist);
  //     })
  //     .catch((err) => alertErrors(err?.code));
  // }, []);
  return (
    <div className="artists">
      <h1>Artistas</h1>
      {/* <Grid>
        {map(artists, (a) => (
          <Grid.Column key={a.id} mobile={8} tablet={4} computer={3}>
            <RenderArtist key={a.id} artist={a} />
          </Grid.Column>
        ))}
      </Grid> */}
    </div>
  );
}

function RenderArtist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`artist/${artist.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBannerUrl(url);
      })
      .catch((err) => alertErrors(err?.code));
  }, [artist]);
  return (
    <Link to={`/artist/${artist.id}`}>
      <div className="artist__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${bannerUrl}')` }}
        />
        <h3>{artist.name}</h3>
      </div>
    </Link>
  );
}
