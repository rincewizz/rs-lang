import React from 'react';
import CardDev from './CardDev';
import fotoVV from '../../assets/img/vv.jpeg';
import fotoOS from '../../assets/img/os.jpg';
import fotoGR from '../../assets/img/gr.ico';
import './CardDev.scss';

const devs = [
  { foto: fotoVV, name: 'Вераника', text: 'Разработала' },
  { foto: fotoGR, name: 'Глеб', text: 'Разработал' },
  { foto: fotoOS, name: 'Ольга', text: 'Разработала' },
];

function TeamSection() {
  return (
    <div className="main">
      <section className="team">
        <h2>Наша команда разработчиков</h2>
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
