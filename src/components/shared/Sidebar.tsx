import React from 'react';
import './sidebar.scss';
import home from '../../assets/img/home.svg';
import team from '../../assets/img/team.svg';
import book from '../../assets/img/book.svg';
import game from '../../assets/img/game.png';
import statistic from '../../assets/img/statistic.png';
import SidebarItem from './SidebarItem';

class Sidebar extends React.PureComponent {
  render(): React.ReactNode {
    const items = [
      { img: home as string, name: 'Home', alt: 'home' },
      { img: team, name: 'Team', alt: 'team' },
      { img: book, name: 'Book', alt: 'book' },
      { img: game, name: 'Game', alt: 'game' },
      { img: statistic, name: 'Statistics', alt: 'statistics' },
    ];
    const list = items.map((item) => <SidebarItem el={item} />);
    return (
      <aside className="aside">
        <div className="bar" />
        <ul className="link-list">{list}</ul>
      </aside>
    );
  }
}
export default Sidebar;
