import React from 'react';
import './sidebar.scss';
import { SidebarItemProps } from '../../types/index';

class SidebarItem extends React.PureComponent<SidebarItemProps> {
  render(): React.ReactNode {
    const {
      el: { img, alt, name },
    } = this.props;
    return (
      <li>
        <div className="img-item aside-cell">
          <img src={img} alt={alt} />
        </div>
        <div className="link-list-name aside-cell">{name}</div>
      </li>
    );
  }
}

export default SidebarItem;
