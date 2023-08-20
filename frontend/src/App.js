import logo from './logo.svg';
import './App.css';
import useFetch from './hooks/useFetch';
import Button from '@mui/material/Button';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// pages
import HomePage from './components/pages/homePage';
import MenuPage from './components/pages/menuPage';
import TestePage from './components/pages/testePage'
import React from 'react';

function App() {
  const { data: dataFromBackend, loading } = useFetch('http://localhost:5000/api/test');

  // the key is the page name, and the value is the component
  const pageComponents = {
    Home: HomePage,
    Menu: MenuPage,
    Teste: TestePage,
  };

  const PAGES = Object.keys(pageComponents);

  return (
    <div className="App">
      <ResponsiveAppBar project_name={'OESK'} pages={PAGES} settings={['Profile', 'Account', 'Dashboard', 'Logout']} />
      <main>
        <Router>
          <Routes>
            {PAGES.map((page) => (
              <Route key={page} path={`/${page}`} element={React.createElement(pageComponents[page])} />
            ))}
          </Routes>

        </Router>
        <br />
        <br />
        <br />
        <br />
        <br />
        {dataFromBackend.message}


      </main>
    </div>
  );
}

export default App;
