import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import Home from './pages/home/Home';
import Textbook from './pages/textbook/Textbook';
import VoiceGame from './pages/voiceGame/Voicegame';
import VoiceGameRound from './pages/voiceGame/VoicegameRound';

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Textbook />} />
        <Route path="/voicegame" element={<VoiceGame />} />
        <Route path="/voicegameround" element={<VoiceGameRound />} />
        <Route path="*" element={<h2 className="textError">Ресурс не найден</h2>} />
      </Routes>
    </Router>
  );
}
