import React from 'react';
import './style.scss';
import Sidebar from '../../components/shared/Sidebar';

export default class Home extends React.PureComponent {
  render() {
    return (
      <>
        <Sidebar />
        <div>Главная страница</div>;
      </>
    );
  }
}
