import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MobileFrame } from './components/MobileFrame';
import { SplashScreen } from './pages/SplashScreen';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { CityDetail } from './pages/CityDetail';
import { Challenge } from './pages/Challenge';
import { Results } from './pages/Results';
import { Profile, Badges, Leaderboard } from './pages/ExtraPages';
import './App.css';

function App() {
  return (
    <Router>
      <MobileFrame>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/city/:cityId" element={<CityDetail />} />
          <Route path="/challenge/:challengeId" element={<Challenge />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </MobileFrame>
    </Router>
  );
}

export default App;
