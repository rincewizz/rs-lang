import React from 'react';
import './style.scss';
import home from '../../assets/img/home.svg';
import team from '../../assets/img/team.svg';
import book from '../../assets/img/book.svg';
import game from '../../assets/img/game.png';
import statistic from '../../assets/img/statistic.png';

class Sidebar extends React.PureComponent {
  render(): React.ReactNode {
    return (
      <aside className="aside">
        <div className="bar" />
        <ul className="link-list">
          <li>
            <div className="img-item aside-cell">
              <img src={home} alt="home" />
            </div>
            <div className="link-list-name aside-cell">Home</div>
          </li>
          <li>
            <div className="img-item aside-cell">
              <img src={book} alt="home" />
            </div>
            <div className="link-list-name aside-cell">Log in</div>
          </li>
          <li>
            <div className="img-item aside-cell">
              <img src={team} alt="home" />
            </div>
            <div className="link-list-name aside-cell">Book</div>
          </li>
          <li>
            <div className="img-item aside-cell">
              <img src={game} alt="home" width="40px" />
            </div>
            <div className="link-list-name aside-cell">Games</div>
          </li>
          <li>
            <div className="img-item aside-cell">
              <img src={statistic} alt="home" width="30px" />
            </div>
            <div className="link-list-name aside-cell">Statistics</div>
          </li>
        </ul>
      </aside>
    );
  }
}
export default Sidebar;
