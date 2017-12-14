import React, {Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './style/App.css';
import Landing from './landing';
import Calendar from './calendar';
import Study from './study';
import CoreHeader from './coreHeader';
import CoreNav from './coreNav';

class App extends Component {
  state = {
    studies: null
  }

  setActiveStudy = (activeStudy) => {
    this.setState(
      {
        activeStudy: activeStudy,
        title: activeStudy.name
      }
    );
  }

  setTitle = (title) => {
    this.setState({title});
  }

  setView = (view) => {
    this.setState({view});
  }

  componentDidMount() {
    fetch('http://globe.church/api/one21')
      .then(res => res.json())
      .then(studies => {
        this.setState({
          studies: studies,
          latest_study: studies[0]
        })
      });
  }

  render () {
    const { studies } = this.state;

    return (
      <Router path="/">
        <div className="app">

          <CoreHeader title={this.state.title} />

          <div className="container">

            <Route path="/calendar" render={({ match }) => (
              <Calendar
                studies={studies}
                setTitle={this.setTitle}
                setView={this.setView}
                />
            )} />

            { studies && (
              <Route path="/study/:studySlug" render={({ match }) => (
                <Study
                  { ...this.state }
                  setActiveStudy={this.setActiveStudy}
                  setView={this.setView}
                  study={studies.find(s => s.slug === match.params.studySlug )} />
              )} />
            )}

            <Route exact path="/" render={({ match }) => (
              <Landing
                study={ this.state.latest_study }
                setTitle={ this.setTitle }
                setView={ this.setView }
              />
            )} />

          </div>

          { studies && (
            <CoreNav
              {...this.state}
              setView={ this.setView }
              currentView={ this.state.view }
              />
          )}
        </div>
      </Router>
    );
  }
};

export default App;
