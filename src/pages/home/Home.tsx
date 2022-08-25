import React from 'react';
import './style.scss';
import '../../assets/styles/fonts.scss';
import Sidebar from '../../components/shared/Sidebar';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import { Advantages } from '../../types';
import martin from '../../assets/img/martin.png';
import pinguin from '../../assets/img/pngwing.png';

const ADVANTAGES = [
  { number: '1', text: 'Learn to speak a new language naturally and conversationally.' },
  { number: '2', text: 'Track your progress' },
  { number: '3', text: 'Learn a language with a rich variety of learning activities' },
  { number: '4', text: 'See results quickly with the proven method' },
];

function addAdvantages(props: Advantages) {
  const el = props;
  return (
    <div className="advantages__item">
      <p className="advantages__number">{el.number}</p>
      <p className="advantages__text">{el.text}</p>
    </div>
  );
}

export default function Home() {
  const greetingComponent = () => {
    return (
      <div className="main">
        <div className="main__greeting">
          <div className="greeting">
            <p className="greeting__start">Start learning English right now!</p>
            <p className="greeting__text">
              <span className="greeting__rslang">RSLang</span> - the best application of studing
              English you have ever met!
            </p>
          </div>
          <img className="greeting__picture" src={pinguin} alt="martin" />
        </div>
        <div className="main__advantages">
          <img className="advantages__picture" src={martin} alt="pinguin" />
          <div className="advantages">{ADVANTAGES.map((item) => addAdvantages(item))}</div>
        </div>
      </div>
    );
  };
  return (
    <div className="wrapper">
      <Sidebar />
      <Header />
      {greetingComponent()}
      <Footer />
    </div>
  );
}
