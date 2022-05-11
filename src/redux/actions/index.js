const GET_TOKEN = 'GET_TOKEN';
const REQUEST_TOKEN = 'REQUEST_TOKEN';
const FAILED_REQUEST = 'FAILED_REQUEST';
const ADD_NEW_PLAYER = 'ADD_NEW_PLAYER';
const REQUEST_QUESTIONS = 'REQUEST_QUESTIONS';
const GET_QUESTIONS = 'GET_QUESTIONS';
const SET_TIMEOUT = 'SET_TIMEOUT';
const SET_SCORE = 'SET_SCORE';
const RESET_SCORE = 'RESET_SCORE';

function getToken(json) {
  return { type: GET_TOKEN, payload: json.token };
}

function requestToken() {
  return { type: REQUEST_TOKEN };
}

function failedRequest(error) {
  return { type: FAILED_REQUEST, payload: error };
}

function requestQuestions() {
  return { type: REQUEST_QUESTIONS };
}

function getQuestions(json) {
  return { type: GET_QUESTIONS, payload: json };
}

export function fetchToken() {
  return async (dispatch) => {
    dispatch(requestToken());
    try {
      const response = await fetch('https://opentdb.com/api_token.php?command=request');
      const json = await response.json();
      return dispatch(getToken(json));
    } catch (error) {
      return dispatch(failedRequest(error));
    }
  };
}

export function fetchQuestions(token) {
  return async (dispatch) => {
    dispatch(requestQuestions());
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
      const json = await response.json();
      return dispatch(getQuestions(json));
    } catch (error) {
      return dispatch(failedRequest(error));
    }
  };
}

const addNewPlayer = (name, email) => ({
  type: ADD_NEW_PLAYER,
  name,
  email,
});

const timerFinished = () => ({
  type: SET_TIMEOUT,
});

const scoreAction = (score) => ({
  type: SET_SCORE,
  score,
});

const resetScore = () => ({
  type: RESET_SCORE,
});

export {
  GET_TOKEN,
  REQUEST_TOKEN,
  FAILED_REQUEST,
  addNewPlayer,
  timerFinished,
  ADD_NEW_PLAYER,
  GET_QUESTIONS,
  REQUEST_QUESTIONS,
  SET_TIMEOUT,
  scoreAction,
  SET_SCORE,
  RESET_SCORE,
  resetScore,
};
