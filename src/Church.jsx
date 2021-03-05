import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Loader from "./Loader";
import ChurchPicker from "./ChurchPicker";

class Church extends Component {
  constructor(props) {
    super(props);
    const currentChurch = JSON.parse(localStorage.getItem("church"));
    this.state = {
      currentChurch,
      church: null,
      slug: null,
      lookup: false,
    };
  }

  componentDidMount() {
    const { setTitle, setView, slug } = this.props;
    setTitle("Loading…");
    setView(`/church/${slug}`);
    this.lookup();
  }

  componentDidUpdate(prevProps) {
    const { slug } = this.state;
    const prevSlug = prevProps.slug;
    if (prevSlug !== slug) {
      this.lookup();
    }
  }

  setChurch(ch) {
    const { setTitle } = this.props;
    setTitle(ch.name);
    this.setState({ church: ch, slug: ch.slug, lookup: false });
    window.scrollTo(0, 0);
  }

  requestJSON = (feedUrl) => new Promise((resolve) => {
    fetch(feedUrl)
      .then((res) => res.json())
      .then((feedJson) => {
        resolve(feedJson);
      });
  })

  lookup() {
    const { lookup } = this.state;
    const { slug } = this.props;
    if (lookup === true) {
      return;
    }

    this.setState({ lookup: true }, () => {
      const { apiEndpoint } = this.props;
      this.requestJSON(`${apiEndpoint}church/${slug}`).then((ch) => {
        this.setChurch(ch);
      });
    });
  }

  confirmChurch() {
    const { church } = this.state;
    const { history } = this.props;
    localStorage.setItem("church", JSON.stringify(church));
    history.push("/");
  }

  showConfirmBtn() {
    const { currentChurch, church } = this.state;

    if (!currentChurch) {
      return true;
    }

    if (currentChurch.slug !== church.slug) {
      return true;
    }

    return false;
  }

  render() {
    const { church } = this.state;
    const { apiEndpoint } = this.props;
    return (
      <main className="landing">
        <div className="tablecloth" />

        <div className="churchPickerPage">
          {church ? (
            <section className="card">
              {church.lead_image && (
                <header>
                  <img src={church.lead_image} alt="" />
                </header>
              )}

              <div className="card__body">
                <p className="pre_title">Church details</p>
                <h1 className="big_title">{church.name}</h1>
                <p>{church.url}</p>
                <p>{church.email}</p>

                {/* TODO: The confirm button needs styling  */}
                {this.showConfirmBtn() && (
                  <button
                    type="button"
                    className="btn action_text"
                    onClick={this.confirmChurch.bind(this)}
                  >
                    Set as my church
                  </button>
                )}
              </div>
            </section>
          ) : (
            <main className="landing">
              <div className="tablecloth" />
              <div className="churchPickerPage">
                <Loader message="Loading church details…" minHeight="379px" />
              </div>
            </main>
          )}

          <ChurchPicker apiEndpoint={apiEndpoint} />
        </div>
      </main>
    );
  }
}

export default withRouter(Church);

Church.propTypes = {
  slug: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
