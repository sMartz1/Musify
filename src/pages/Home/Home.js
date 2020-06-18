import React, { useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import "./Home.scss";
import firebase from "../../utils/firebase";
import "firebase/firestore";
import alertErrors from "../../utils/AlertErrors";
import { map } from "lodash";

const db = firebase.firestore(firebase);

export default function Home(props) {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((d) => {
        const arrayArtist = [];
        map(d?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtist.push(data);
        });
        setArtists(arrayArtist);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);

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
      });
  }, []);
  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Ultimos artistas"
          data={artists}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Ultimos albums"
          data={albums}
          folderImage="album"
          urlName="album"
        />
      </div>
    </>
  );
}
