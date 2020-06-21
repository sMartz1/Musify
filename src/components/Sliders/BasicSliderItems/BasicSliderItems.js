import React, { useEffect, useState } from "react";
import { map, size } from "lodash";
import Slider from "react-slick";
import firebase from "../../../utils/firebase";
import { Link } from "react-router-dom";

import "firebase/storage";
import "./BasicSliderItems.scss";

export default function BasicSliderItems(props) {
  const { title, data, folderImage, urlName } = props;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: size(data) > 6 ? 6 : size(data),
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  if (size(data) < 1) {
    return null;
  }
  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <RenderItem
            key={item.id}
            item={item}
            folderImage={folderImage}
            urlName={urlName}
          />
        ))}
      </Slider>
    </div>
  );
}

function RenderItem(props) {
  const [imageUrl, setImageUrl] = useState(null);
  const { item, folderImage, urlName } = props;

  useEffect(() => {
    firebase
      .storage()
      .ref(`${folderImage}/${item.banner}`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      });
  }, [item, folderImage]);
  return (
    <Link to={`/${urlName}/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
}
