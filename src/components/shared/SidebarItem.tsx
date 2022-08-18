import React from 'react';
import './sidebar.scss';
import { SidebarItemProps } from '../../types/index';

class SidebarItem extends React.PureComponent<SidebarItemProps> {
  render(): React.ReactNode {
    const { el } = this.props;
    return (
      <li>
        <div className="img-item aside-cell">
          <img src={el.img} alt={el.alt} />
        </div>
        <div className="link-list-name aside-cell">{el.name}</div>
      </li>
    );
  }
}

export default SidebarItem;
