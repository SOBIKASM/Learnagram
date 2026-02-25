import React from 'react'
import {  Routes, Route } from "react-router-dom";
import Welcome from './pages/Welcome'
import Navigation from './pages/Navigation';

function App() {
  return (

      <Routes>
        <Route path="/*" element={<Welcome />} />
        <Route path="/navigation/*" element={<Navigation />} />
      </Routes>

  )
}

export default App
