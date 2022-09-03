import React from 'react';
import rssLogo from '../../assets/img/rs_school.svg';
import ghLogo from '../../assets/img/GitHub.svg';
import './footer.scss';

function Footer() {
  return (
    <div className="container container-footer">
      <footer className="footer">
        <a href="https://rs.school/js/">
          <img src={rssLogo} className="footer__logo-rss" alt="logo rs school" />
        </a>
        <div className="footer__title">
          <span>2022 </span>
          <span>copyright. All rights reserved</span>
        </div>
        <div className="footer__info">
          <a href="https://github.com/rincewizz">
            <img src={ghLogo} className="footer__logo" alt="" />
            <span>Gleb Roskin</span>
          </a>
          <a href="https://github.com/ol4ik88">
            <img src={ghLogo} className="footer__logo" alt="" />
            <span>Slapik Olga</span>
          </a>
          <a href="https://github.com/veronicavoevodina">
            <img src={ghLogo} className="footer__logo" alt="" />
            <span>Veranika Vayavodzina</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
