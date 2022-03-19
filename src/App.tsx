import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Nav/Header';
import Footer from './components/Nav/Footer';
import WalletConnectContextProvider from './context/WalletConnectContextProvider';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Explore from './pages/Explore';
import CampaignPage from './pages/Campaign/CampaignPage';

function App() {
  return (
    <div className="App flex flex-col h-screen">
      <WalletConnectContextProvider>
        <Header />
      </WalletConnectContextProvider>
      <BrowserRouter>
        <div className="h-auto">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/explore" element={<Explore />} />
            <Route path="/campaign/:id" element={<CampaignPage />} />
            <Route
              path="*"
              element={
                <div className="error-empty font-bold text-xl">
                  Oops looks like you have hit an empty space.
                </div>
              }
            />
          </Routes>{' '}
        </div>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
