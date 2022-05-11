import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Question from '../components/Question';

class Quiz extends Component {
  render() {
    const { history } = this.props;
    return (
      <div>
        <Header />
        <Question history={ history } />
      </div>
    );
  }
}

Quiz.propTypes = ({
  history: PropTypes.objectOf(PropTypes.any).isRequired,
});

export default Quiz;
