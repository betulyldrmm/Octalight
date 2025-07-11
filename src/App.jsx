import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Koleksiyon from './pages/Koleksiyon/Koleksiyon';

import Golden from './pages/Golden/Golden';
import Nest from './pages/Nest/Nest';
import Pearls from './pages/Pearls/Pearls';
import Ronmite from './pages/Ronmite/Ronmite';
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/koleksiyon" element={<Koleksiyon />} />
        <Route path="/golden" element={<Golden />} />
             <Route path="/nest" element={<Nest />} />
       <Route path="/pearls" element={<Pearls />} />
          <Route path="/ronmite" element={<Ronmite />} />
      </Routes>
    </Router>
  );
}

export default App;