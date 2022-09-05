/* eslint-disable no-underscore-dangle */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
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
import useAuthStore from './services/storage/Auth';
import userApi from './services/api/Users';

export default function App() {
  const auth = useAuthStore((state) => state.auth);
  const setAuth = useAuthStore((state) => state.setAuth);

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response ? error.response.status : null;
      let newTokens;
      if (status === 401 && !error.config._retry) {
        const { config } = error;
        try {
          if (auth.userId && auth.refreshToken) {
            newTokens = await userApi.getNewToken({
              userId: auth.userId,
              token: auth.refreshToken,
            });
            if (newTokens.token && newTokens.refreshToken) {
              auth.token = newTokens.token;
              auth.refreshToken = newTokens.refreshToken;
              setAuth(auth);
            } else {
              setAuth({});
            }
          }
        } catch {
          return Promise.reject(error);
        }

        if (newTokens?.token && newTokens.refreshToken) {
          config._retry = true;
          config.headers.Authorization = `Bearer ${newTokens?.token}`;
          return axios.request(error.config);
        }
      }

      return Promise.reject(error);
    }
  );

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
