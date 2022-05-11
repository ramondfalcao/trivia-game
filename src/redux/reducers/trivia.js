import { GET_QUESTIONS, SET_TIMEOUT } from '../actions';

const INITIAL_STATE = {};

function trivia(state = INITIAL_STATE, action) {
  switch (action.type) {
  case GET_QUESTIONS:
    return {
      ...state,
      payload: action.payload,
    };
  case SET_TIMEOUT:
    return {
      ...state,
      timeout: true,
    };
  default:
    return state;
  }
}

export default trivia;
