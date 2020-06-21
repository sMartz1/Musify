import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { map, size } from "lodash";
import Slider from "react-slick";
import firebase from "../../../utils/firebase";
import "firebase/storage";
import "firebase/firestore";

import "./SongsSlider.scss";
import alertErrors from "../../../utils/AlertErrors";

const db = firebase.firestore(firebase);
export default function SongsSlider(props) {
  const { title, data, playerSong } = props;

  const settings = {
    dots: false,
    infinity: true,
    speed: 500,
    slidesToShow: size(data) > 5 ? 5 : size(data),
    slidesToScroll: 1,
    centerMode: true,
    className: "song-slider__list",
  };

  return (
    <div className="song-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (s) => {
          return <Song key={s.id} item={s} playerSong={playerSong} />;
        })}
      </Slider>
    </div>
  );
}

function Song(props) {
  const { item, playerSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(item.album)
      .get()
      .then((r) => {
        const data = r.data();
        data.id = r.id;
        setAlbum(data);
        getImage(data);
      })
      .catch((err) => alertErrors(err?.code));
  }, [item]);

  const getImage = (alb) => {
    firebase
      .storage()
      .ref(`album/${alb.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      })
      .catch((err) => alertErrors(err?.code));
  };

  const onPlay = () => {
    console.log(item);

    playerSong(banner, item.name, item.fileName);
  };
  return (
    <div className="song-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}
