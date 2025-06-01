import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';

// Secciones de la landing
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Benefits from './components/Benefits';
import CtaFooter from './components/CtaFooter';

// Páginas internas
import Dashboard from './pages/Dashboard';
import Respiraciones from './pages/Respiraciones';
import Respiracion1 from './pages/Respiracion1';

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ProblemSolution />
              <Benefits />
              <CtaFooter />
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/respiraciones" element={<Respiraciones />} />
        <Route path="/Respiracion1" element={<Respiracion1 />} />
      </Routes>
    </Router>
  );
}

export default App;

