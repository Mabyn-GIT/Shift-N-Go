import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import FloatingButtons from './components/Layout/FloatingButtons';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </main>
              <FloatingButtons />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;