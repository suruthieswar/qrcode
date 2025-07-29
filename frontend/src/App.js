import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Selector from './Selector';
import Home from './Home';
import ManagerLogin from './ManagerLogin';
import ManagerPage from './ManagerPage';
import BookingPage from './BookingPage';     // ✅ newly added
import SummaryPage from './SummaryPage';
import Return from './Return';

     // ✅ newly added

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selector" element={<Selector />} />
        <Route path="/home" element={<Home />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/manager-page" element={<ManagerPage />} />
        <Route path="/return" element={<Return />} />
        {/* Newly added booking and summary pages */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
