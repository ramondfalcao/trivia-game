import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Ranking.css';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const users = JSON.parse(localStorage.getItem('users'));
    users.sort((a, b) => b.score - a.score);
    this.setState({ users });
  }

  render() {
    const { users } = this.state;
    return (
      <main className="ranking-page">
        <h1 data-testid="ranking-title" className="ranking-title">Ranking</h1>
        <section className="ranking-container">
          { users.map((user, index) => (
            <div key={ index } className="user-wrapper">
              <img
                src={ user.picture }
                alt={ `Foto de ${user.score}` }
                className="header-profile"
              />
              <span
                data-testid={ `player-name${index}` }
                className="user-name"
              >
                { user.name }
              </span>
              <span
                data-testid={ `player-score${index}` }
                className="user-score"
              >
                {`⭐ ${user.score}`}
              </span>
            </div>
          )) }
        </section>
        <Link to="/">
          <button
            data-testid="btn-go-home"
            type="button"
            className="go-home-button"
          >
            Home
          </button>
        </Link>
      </main>
    );
  }
}
export default Ranking;
