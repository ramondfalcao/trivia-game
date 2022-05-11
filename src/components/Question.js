import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchQuestions, scoreAction } from '../redux/actions';
import Loading from './Loading';
import gravatarAPI from '../services/gravatarAPI';
import './Question.css';
import timerImg from '../assets/timerImg.svg';
import he from 'he';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      shuffledAlternatives: [],
      index: 0,
      loading: true,
      correctAlt: '',
      incorrectAlt: '',
      timer: 30,
      timeout: false,
      isClicked: false,
      score: 0,
    };
  }

  componentDidMount() {
    this.getQuestions();
    this.handleTimer();
  }

  handleTimer = () => {
    const oneSecond = 1000;
    this.intervalID = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer === 0
        ? 0 : prevState.timer - 1 }), () => {
        const { timer } = this.state;
        if (timer === 0) {
          this.setState({ timeout: true });
          clearInterval(this.intervalID);
        }
      });
    }, oneSecond);
  }

  getQuestions = async () => {
    const { dispatchFetchQuestions, token } = this.props;
    const { index } = this.state;
    await dispatchFetchQuestions(token);
    const { propsQuestions } = this.props;
    this.setState({ questions: propsQuestions.results, loading: false }, () => {
      const { questions } = this.state;
      this.shuffleAlternatives(questions[index]);
    });
  }

  // https://www.horadecodar.com.br/2021/05/10/como-embaralhar-um-array-em-javascript-shuffle/
  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  shuffleAlternatives = (object) => {
    let alternatives = object.incorrect_answers.map((answer) => ({
      answer,
      isCorrectAnswer: false,
      difficulty: object.difficulty,
    }));

    alternatives = [...alternatives, {
      answer: object.correct_answer,
      isCorrectAnswer: true,
      difficulty: object.difficulty }];

    const shuffledArray = this.shuffleArray(alternatives);
    this.setState({ shuffledAlternatives: shuffledArray });
  }

  calculatePoints = async (difficulty, answerTime) => {
    const { dispatchScore } = this.props;

    const standardPoint = 10;
    const hardPoint = 3;
    const mediumPoint = 2;
    const easyPoint = 1;
    let totalScore;

    switch (difficulty) {
    case 'hard':
      totalScore = (standardPoint + (answerTime * hardPoint));
      break;
    case 'medium':
      totalScore = (standardPoint + (answerTime * mediumPoint));
      break;
    case 'easy':
      totalScore = (standardPoint + (answerTime * easyPoint));
      break;
    default:
      return 0;
    }
    this.setState((prevState) => ({ score: prevState.score + totalScore }));
    dispatchScore(totalScore);
  }

  handleAnswerClick = (e) => {
    e.preventDefault();
    const { target: { value, name } } = e;
    this.setState({
      correctAlt: 'CorrectAns',
      incorrectAlt: 'IncorrectAns',
      isClicked: true,
      timer: 0,
    });

    if (value === 'correct') {
      const { timer } = this.state;
      this.calculatePoints(name, timer);
    }
  }

  handleRanking = () => {
    const urlImage = gravatarAPI();
    const { score } = this.state;
    const { name } = this.props;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = {
      name,
      score,
      picture: urlImage,
    };
    users = [...users, user];
    localStorage.setItem('users', JSON.stringify(users));
  }

  handleNextButton = () => {
    const maxQuestion = 4;
    const { index } = this.state;
    const { history } = this.props;
    if (index === maxQuestion) {
      this.handleRanking();
      history.push('/feedback');
    } else {
      this.setState((prevState) => ({
        index: prevState.index + 1,
        timer: 30,
        timeout: false,
        correctAlt: '',
        incorrectAlt: '',
      }), () => {
        this.handleNextQuestion();
      });
    }
  }

  handleNextQuestion = () => {
    const { index, questions } = this.state;
    this.handleTimer();
    this.shuffleAlternatives(questions[index]);
  }

  renderAlternatives = () => {
    const { correctAlt, incorrectAlt, shuffledAlternatives, timeout } = this.state;
    return shuffledAlternatives
      .map((alternative, i) => (
        <button
          key={ i }
          type="button"
          name={ alternative.difficulty }
          disabled={ timeout }
          className={ alternative.isCorrectAnswer
            ? correctAlt
            : incorrectAlt }
          data-testid={ alternative.isCorrectAnswer
            ? 'correct-answer' : `wrong-answer-${i}` }
          value={ alternative.isCorrectAnswer
            ? 'correct' : 'wrong' }
          onClick={ this.handleAnswerClick }
        >
          { he.decode(alternative.answer) }
        </button>
      ));
  }

  render() {
    const { questions,
      index,
      loading,
      timer,
      isClicked,
    } = this.state;

    return (
      <div className="quiz-container">
        <div className="questions-container">
          { loading
            ? <Loading />
            : (
              <>
                <p
                  className="category"
                  data-testid="question-category"
                >
                  {questions[index].category}
                </p>
                <p
                  className="question"
                  data-testid="question-text"
                >
                  {he.decode(questions[index].question)}
                </p>
                <div className="alternatives" data-testid="answer-options">
                  { this.renderAlternatives() }
                </div>
                <div>
                  <img className="timer-img" src={ timerImg } alt="timer" />
                  <p>{ timer }</p>
                </div>
              </>
            ) }
          {isClicked && (
            <div className="div-btn-next">
              <button
                type="button"
                className="btn-next"
                data-testid="btn-next"
                onClick={ this.handleNextButton }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
  propsQuestions: state.trivia.payload,
  name: state.player.name,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchQuestions: (token) => dispatch(fetchQuestions(token)),
  dispatchScore: (score) => dispatch(scoreAction(score)),
});

Question.defaultProps = ({
  propsQuestions: {},
});

Question.propTypes = ({
  dispatchFetchQuestions: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  propsQuestions: PropTypes.objectOf(PropTypes.any),
  dispatchScore: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  name: PropTypes.string.isRequired,
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
