import React, { Component } from "react";
import {
  string, func, bool, arrayOf, objectOf, shape,
} from "prop-types";
import { Link } from "react-router-dom";
import Card from "./Card";
import SermonListItem from "./SermonListItem";
import "./style/SermonList.css";

export default class GuideList extends Component {
  componentDidMount() {
    const { setTitle, setView } = this.props;
    setTitle("Guides");
    setView("/guides");
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const { church, guides, promoted_guide: promotedGuide } = this.props;
    const sermon = guides.filter((g) => g.slug === "sermons")[0];
    return (
      <div className="study">
        <div className="tablecloth" />

        {sermon && (
          <Card
            pretitle={church.name}
            image={sermon.image}
            title={sermon.name}
            description={sermon.teaser}
            cta="Go to recent sermons"
            link={`/guides/${sermon.slug}`}
          />
        )}

        {promotedGuide && (
          <Card
            image={promotedGuide.image}
            pretitle="Featured guide:"
            title={promotedGuide.name}
            description={promotedGuide.teaser}
            cta="Go to guide"
            link={`/guides/${promotedGuide.slug}`}
          />
        )}

        {guides
          && guides.map((guide) => (
            <div className="sermonList" key={guide.slug}>
              <Link
                to={{
                  pathname: `/guides/${guide.slug}`,
                }}
              >
                <SermonListItem
                  name={guide.name}
                  passage={guide.teaser}
                  displayImage={false}
                />
              </Link>
            </div>
          ))}
      </div>
    );
  }
}

GuideList.propTypes = {
  setTitle: func.isRequired,
  setView: func.isRequired,
  guides: arrayOf(shape({
    copyRight: string,
    description: string,
    highlight_first: bool,
    image: string,
    images: objectOf(string),
    name: string,
    slug: string,
    teaser: string,
  })).isRequired,
  church: shape({
    email: string,
    lead_image: string,
    lead_images: objectOf(string),
    logo: string,
    logo_sq: string,
    logo_sq_large: string,
    name: string,
    slug: string,
    url: string,
  }).isRequired,
  promoted_guide: shape(),
};

GuideList.defaultProps = {
  promoted_guide: null,
};
