import React, { Component } from "react";
import {
  string, arrayOf, shape,
} from "prop-types";
import ExpandableText from "./ExpandableText";

export default class Question extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      itemNo, question, passage, scripture,
    } = this.props;
    window.scrollTo(0, 0);
    return (
      <section className="study__question question">
        {question.lead && (
          <header className="question__header">
            <span>
              Question
              {itemNo}
              :
            </span>
            <h2>{question.lead}</h2>
          </header>
        )}

        {question.type === "pause" && (
          <header className="question__header">
            <span>Pause</span>
            <h2>{question.body}</h2>
          </header>
        )}

        {question.followup && (
          <ul className="question__subquestions">
            {question.followup.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        )}

        {scripture && (
          <section className="question__scripture">
            <h2 className="dinky_title">{passage}</h2>
            <ExpandableText
              expanded
              scripture
              text={scripture}
            />
          </section>
        )}
      </section>
    );
  }
}

Question.propTypes = {
  question: shape({
    followup: arrayOf(string),
    lead: string,
    type: string,
  }).isRequired,
  itemNo: string.isRequired,
  location: string,
  passage: string.isRequired,
  scripture: arrayOf(string).isRequired,
};

Question.defaultProps = {
  location: null,
};
