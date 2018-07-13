import React from 'react';
import { connect } from 'react-redux';
import requiresLogin from './requires-login';
import { fetchNextQuestion } from '../actions/questions';
import { clearAnswer, fetchAnswers } from '../actions/answers';

import './dashboard.css';

export class Dashboard extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchNextQuestion());
  }

  renderResults() {
    if (this.props.loading) {
      return <p>Loading next question...</p>;
    }

    if (this.props.error) {
      return <strong>{this.props.error}</strong>;
    }

    return (
      <React.Fragment>
        <div>
          <img
            className="dashboard-card-img"
            src={this.props.question.prompt}
            alt="algorithm"
          />
        </div>
        <div>
          {this.props.answer
            ?
            <p>
              Answer is: {this.props.answer}
            </p>
            :
            <p>What is the answer?</p>
          }
        </div>
        <label>
          <input
            id="text-input"
            type="text"
            title="Answer"
            aria-label="Answer"
            ref={input => (this.input = input)}
          />
        </label>
        <div>
          <button
            type="submit"
            onClick={this.onSubmit}
            aria-label="click to submit answer"
          >
            Submit
          </button>
          <button
            type="button"
            disabled={!this.props.answer}
            onClick={this.onNext}
          >
            Next
          </button>
        </div>
      </React.Fragment>
    );
  }

  onSubmit = e => {
    e.preventDefault();
    const userAnswer = {
      answer: this.input.value,
    };
    this.props.dispatch(fetchAnswers(userAnswer))
  };

  onNext = e => {
    e.preventDefault();
    this.props.dispatch(clearAnswer());
    this.props.dispatch(fetchNextQuestion());
    this.input.value = '';
    this.input.focus();
  };

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-username">
          Username: {this.props.username}
        </div>
        <div className="dashboard-name">
          Name: {this.props.name}
        </div>
        <div className="guess-section">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentUser } = state.auth;
  return {
    username: currentUser.username,
    name: `${currentUser.firstname} ${currentUser.lastname}`,
    question: state.questions.data,
    loading: state.questions.loading,
    error: state.questions.error,
    answer: state.answer.answer,
  };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
