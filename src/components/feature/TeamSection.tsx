import React from 'react';
import CardDev from './CardDev';
import fotoVV from '../../assets/img/vv.jpeg';
import fotoOS from '../../assets/img/os.jpg';
import fotoGR from '../../assets/img/gr.ico';
import './CardDev.scss';

const devs = [
  {
    foto: fotoGR,
    name: 'Глеб - Team Lead',
    text: 'Разработал: конфигурацию и структуру проекта, настроил сервер, список слов, полностью раздел учебник, глобальное хранилище, функционал изученные слова, сложные слова и прогресс изучения, участвовал в разработке игр, рефакторинг кода.',
  },
  {
    foto: fotoOS,
    name: 'Ольга - Developer',
    text: 'Разработала: компоненты страницы header и footer, страницу команды разработчиков, раздел авторизации, раздел статистики, настройка маршрутизации в проекте, создание общих стилей и адаптивная вёрстка.',
  },
  {
    foto: fotoVV,
    name: 'Вероника - Developer',
    text: 'Разработала: компонент боковой панели меню, раздел главная страница, UI и алгоритм игр "Спринт" и "Аудиовызов".',
  },
];

function TeamSection() {
  return (
    <div className="main">
      <section className="team">
        <h2 className="title-page">Наша команда разработчиков</h2>
        <div className="info-devs">
          {devs.map((dev) => (
            <div key={dev.name}>
              <CardDev devs={dev} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default TeamSection;
