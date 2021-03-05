import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from "./Icon";
import "./style/CoreNav.css";

const CoreNav = ({ view, guides }) => (
  <nav className="coreNav">
    <Link to={{ pathname: "/" }} className={`coreNav__item ${view === "/" ? "coreNav__item--active" : ""}`}>
      <Icon icon="home" />
      Home
    </Link>

    { guides && guides.length > 1 && (
      <Link to={{ pathname: "/guides" }} className={`coreNav__item ${view && view.indexOf("/guides") !== -1 ? "coreNav__item--active" : ""}`}>
        <Icon icon="study" />
        Guides
      </Link>
    )}

    { guides && guides.length === 1 && (
      <Link to={{ pathname: `/guides/${guides[0].slug}` }} className={`coreNav__item ${view && view.indexOf("/guides") !== -1 ? "coreNav__item--active" : ""}`}>
        <Icon icon="study" />
        Guide
      </Link>
    )}

    <Link to={{ pathname: "/profile" }} className={`coreNav__item ${view === "/profile" ? "coreNav__item--active" : ""}`}>
      <Icon icon="person" />
      Me
    </Link>
  </nav>
);

CoreNav.propTypes = {
  view: PropTypes.string,
  guides: PropTypes.arrayOf(PropTypes.shape({
    copyRight: PropTypes.string,
    description: PropTypes.string,
    highlight_first: PropTypes.bool,
    image: PropTypes.string,
    images: PropTypes.objectOf(PropTypes.string),
    name: PropTypes.string,
    slug: PropTypes.string,
    teaser: PropTypes.string,
  })),
};

CoreNav.defaultProps = {
  view: null,
  guides: null,
};

export default CoreNav;
