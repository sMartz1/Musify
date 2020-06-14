import React, { useState, useEffect } from "react";
import firebase from "../../utils/firebase";
import "firebase/storage";
import "./BannerHome.scss";
import alertErrors from "../../utils/AlertErrors";
export default function BannerHome() {
  const [bannerUrl, setBannerUrl] = useState(null);
  useEffect(() => {
    firebase
      .storage()
      .ref("other/banner-home.jpg")
      .getDownloadURL()
      .then((url) => {
        setBannerUrl(url);
      })
      .catch((err) => alertErrors(err?.code));
  }, []);

  if (!bannerUrl) {
    return null;
  }
  return (
    <div
      className="banner-home"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    ></div>
  );
}
