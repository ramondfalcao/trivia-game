import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Login.css';
import { fetchToken, addNewPlayer, resetScore } from '../redux/actions';
import logoBlue from '../assets/logoBlue.svg';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isButtonDisabled: true,
      name: '',
      email: '',
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.enableButton);
  }

  enableButton = () => {
    const { name, email } = this.state;
    const isNameValid = name.length > 0;
    const isEmailValid = email.length > 0;
    this.setState({ isButtonDisabled: !(isNameValid && isEmailValid) });
  }

  handleClick = async () => {
    const { dispatchUser, requestToken, history, dispatchResetScore } = this.props;
    const { name, email } = this.state;
    await requestToken();
    dispatchUser(name, email);
    dispatchResetScore();
    history.push('/quiz');
  }

  render() {
    const { name, email, isButtonDisabled } = this.state;
    return (
      <main className="main-login">
        <img className="logo" src={ logoBlue } alt="logo" />
        <form className="form">
          <label htmlFor="name">
            <input
              placeholder="Name"
              className="input-login"
              type="text"
              data-testid="input-player-name"
              id="name"
              name="name"
              value={ name }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="email">
            <input
              placeholder="Email"
              className="input-login"
              type="text"
              data-testid="input-gravatar-email"
              id="email"
              name="email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <button
            className="btn-play"
            data-testid="btn-play"
            type="button"
            disabled={ isButtonDisabled }
            onClick={ this.handleClick }
          >
            Play
          </button>
          <Link to="/configuracoes">
            <button
              className="btn-config"
              type="button"
              data-testid="btn-settings"
            >
              Configurações
            </button>
          </Link>
        </form>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestToken: () => dispatch(fetchToken()),
  dispatchUser: (name, email) => dispatch(addNewPlayer(name, email)),
  dispatchResetScore: () => dispatch(resetScore()),
});

Login.propTypes = ({
  requestToken: PropTypes.func.isRequired,
  dispatchUser: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatchResetScore: PropTypes.func.isRequired,
});

export default connect(null, mapDispatchToProps)(Login);
