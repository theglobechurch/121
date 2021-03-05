import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";

import {
  func, string, shape, objectOf,
} from "prop-types";
import SermonListItem from "./SermonListItem";
import Study from "./Study";
import Card from "./Card";
import Loader from "./Loader";
import ExpandableText from "./ExpandableText";
import "./style/SermonList.css";

export default class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guide: null,
      sermon: false,
    };
  }

  componentDidMount() {
    const {
      setTitle, setView, slug, church, apiEndpoint,
    } = this.props;
    setTitle("Loading…");
    setView(`/guides/${slug}`);
    const churchSlug = church.slug;

    // TODO: Only request if not already in state or local storage?
    this.requestJSON(
      `${apiEndpoint}church/${churchSlug}/guides/${slug}`,
    ).then((guide) => {
      setTitle(guide.name);
      this.setState({
        guide,
        sermon: this.isSermon(),
      });
    });

    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    const { guide } = this.state;
    const { title, setTitle } = this.props;
    window.scrollTo(0, 0);

    // This feels like a hack
    const curPath = window.location.pathname.split("/").filter(String);
    if (guide && title !== guide.name && curPath.length === 2) {
      setTitle(guide.name);
    }
  }

  requestJSON = (feedUrl) => new Promise((resolve) => {
    fetch(feedUrl)
      .then((res) => res.json())
      .then((feedJson) => {
        resolve(feedJson);
      });
  })

  isSermon = () => {
    const { slug } = this.props;
    if (slug === "sermons") {
      return true;
    }
    return false;
  }

  showListItem(i) {
    // Checks if the study should be shown in the study list.
    // If the first item is highlighted then the first should
    // be skipped
    const { guide, sermon } = this.state;
    if (sermon && i !== 0) {
      return true;
    }

    if (
      !sermon
      && (!guide.highlight_first || (guide.highlight_first && i !== 0))
    ) {
      return true;
    }

    return false;
  }

  selectStudy(studySlug) {
    const { guide } = this.state;
    return guide.studies.find((s) => s.slug === studySlug);
  }

  render() {
    const { guide, sermon } = this.state;
    const { setView, setTitle, slug } = this.props;

    return (
      <div className="study">
        <div className="tablecloth" />

        <Switch>
          {guide && (
            <Route
              path="/guides/:guideSlug/:studySlug"
              render={({ match }) => (
                <Study
                  guide={guide}
                  sermon={sermon}
                  guideSlug={match.params.guideSlug}
                  studySlug={match.params.studySlug}
                  setView={setView}
                  setTitle={setTitle}
                  study={this.selectStudy(match.params.studySlug)}
                  image={guide.image}
                />
              )}
            />
          )}

          <Route
            path="/guides/:guideSlug"
            render={() => (
              <main>
                {guide ? (
                  <div>
                    {guide.image && (
                      <div
                        className="study__introduction__image"
                        style={{ backgroundImage: `url(${guide.image})` }}
                      />
                    )}

                    {guide.highlight_first || sermon ? (
                      <Card
                        className="card--pullUp"
                        image={guide.studies[0].image}
                        title={guide.studies[0].name}
                        description={guide.studies[0].description}
                        descriptionLimit
                        cta="Go to study"
                        link={`/guides/${slug}/${
                          guide.studies[0].slug
                        }`}
                      />
                    ) : (
                      <section className="study__introduction__section">
                        <h1 className="big_title">{guide.name}</h1>
                        {guide.description
                        && guide.description.length >= 1
                        && !sermon ? (
                          <ExpandableText
                            expanded
                            text={guide.description}
                          />
                          ) : (
                            <p>{guide.description}</p>
                          )}
                      </section>
                    )}

                    {guide.studies
                      && guide.studies.map((study, index) => (
                        <div key={study.slug}>
                          {this.showListItem(index) === true && (
                            <Link
                              className="sermonList"
                              to={{
                                pathname: `/guides/${slug}/${
                                  study.slug
                                }`,
                              }}
                            >
                              <SermonListItem
                                name={study.name}
                                date={study.date}
                                image={study.image}
                                passage={study.passage}
                                displayImage={false}
                              />
                              {/* <SermonListItem {...study} displayImage={false} /> */}
                            </Link>
                          )}
                        </div>
                      ))}

                    {guide.license && (
                      <section className="study__introduction__section">
                        <p className="dinky_text">{guide.license}</p>
                      </section>
                    )}
                  </div>
                ) : (
                  <main className="landing">
                    <div className="tablecloth" />
                    <div className="churchPickerPage">
                      <Loader message="Loading guide…" minHeight="379px" />
                    </div>
                  </main>
                )}
              </main>
            )}
          />
        </Switch>
      </div>
    );
  }
}

Guide.propTypes = {
  slug: string.isRequired,
  apiEndpoint: string.isRequired,
  setTitle: func.isRequired,
  setView: func.isRequired,
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
  title: string,
};

Guide.defaultProps = {
  title: null,
};
