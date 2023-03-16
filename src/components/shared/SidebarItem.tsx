import React from 'react';
import './sidebar.scss';
import { Link } from 'react-router-dom';
import { SidebarItemProps } from '../../types/index';

class SidebarItem extends React.PureComponent<SidebarItemProps> {
  render(): React.ReactNode {
    const {
      el: { img, alt, name, link },
    } = this.props;
    return (
      <Link to={link} className="link-list__item">
        <div className="img-item aside-cell">
          <img className="img-item__picture" src={img} alt={alt} />
        </div>
        <div className="link-list-name aside-cell">{name}</div>
      </Link>
    );
  }
}

export default SidebarItem;
