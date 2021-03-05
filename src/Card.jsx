import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./style/Card.css";

export default class Card extends Component {
  limitText = (text, charCount = 100) => {
    if (text.length < (charCount + 20)) { return text; }
    const shortenedText = text.substring(0, charCount);
    const lastSpace = shortenedText.lastIndexOf(" ");

    return lastSpace > 0
      ? `${shortenedText.substring(0, lastSpace)}…`
      : `${shortenedText}...`;
  }

  render() {
    const {
      className, description, descriptionLimit, image, pretitle, title, link, cta,
    } = this.props;
    return (
      <section className={`card ${className || ""}`}>
        {image && (
          <header>
            <img src={image} alt="" />
          </header>
        )}

        <div className="card__body">
          { pretitle && (
            <p className="pre_title">{pretitle}</p>
          )}

          <h1 className="big_title">{title}</h1>

          { description && (
            <p>
              { descriptionLimit === true ? (
                this.limitText(description)
              ) : (
                description
              )}
            </p>
          )}

          { link && cta && (
            <Link
              to={{
                pathname: link,
              }}
              className="action_text"
            >
              {cta}
            </Link>
          )}
        </div>
      </section>
    );
  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  pretitle: PropTypes.string,
  description: PropTypes.string.isRequired,
  descriptionLimit: PropTypes.bool,
  link: PropTypes.string.isRequired,
  cta: PropTypes.string.isRequired,
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
};

Card.defaultProps = {
  className: null,
  descriptionLimit: null,
  pretitle: null,
};
