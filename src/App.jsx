import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import Koleksiyon from './pages/Koleksiyon/Koleksiyon';


const App = () => {
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/Koleksiyon' element={<Koleksiyon/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;