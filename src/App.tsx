import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorText from './components/shared/ErrorText';
import Sidebar from './components/shared/Sidebar';
import Home from './pages/home/Home';
import Team from './pages/team/Team';
import Textbook from './pages/textbook/Textbook';
import VoiceGame from './pages/voiceGame/Voicegame';
import VoiceGameRound from './pages/voiceGame/VoicegameRound';
import SprintGame from './pages/sprintGame/Sprintgame';
import SprintGameRound from './pages/sprintGame/SprintgameRound';
import Statistics from './pages/statistics/Statistics';

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Textbook />} />
        <Route path="/team" element={<Team />} />
        <Route path="/voicegame" element={<VoiceGame />} />
        <Route path="/voicegameround" element={<VoiceGameRound />} />
        <Route path="/sprintgame" element={<SprintGame />} />
        <Route path="/sprintgameround" element={<SprintGameRound />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<ErrorText />} />
      </Routes>
    </Router>
  );
}
