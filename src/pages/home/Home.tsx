import React from 'react';
import './style.scss';
import '../../assets/styles/fonts.scss';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import { Advantages } from '../../types';
import martin from '../../assets/img/martin.png';
import pinguin from '../../assets/img/pngwing.png';

const ADVANTAGES = [
  { number: '1', text: 'Учитесь говорить на новом языке естественно в разговорной речи.' },
  { number: '2', text: 'Отслеживайте свой прогресс.' },
  { number: '3', text: 'Изучайте язык с помощью разнообразных учебных методик.' },
  { number: '4', text: 'Анализируйте свои результаты с помощью автопроверки.' },
];

function addAdvantages(props: Advantages) {
  const el = props;
  return (
    <div className="advantages__item" key={el.number}>
      <p className="advantages__number">{el.number}</p>
      <p className="advantages__text">{el.text}</p>
    </div>
  );
}

export default function Home() {
  const greetingComponent = () => {
    return (
      <div className="container container-home">
        <div className="main__greeting">
          <div className="greeting">
            <p className="greeting__start">Начинайте изучать английский язык прямо сейчас!</p>
            <p className="greeting__text">
              <span className="greeting__rslang">RSLang</span> - увлекательное приложение для
              изучения английского языка, с помощью интерактивного учебника и занимательных игр!
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
    <>
      <Header />
      <div className="main">{greetingComponent()}</div>
      <Footer />
    </>
  );
}
