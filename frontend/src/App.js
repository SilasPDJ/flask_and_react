import logo from './logo.svg';
import './App.css';
import useFetch from './hooks/useFetch';
import Button from '@mui/material/Button';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// pages
import HomePage from './components/pages/HomePage';
import MenuPage from './components/pages/MenuPage';
import TestePage from './components/pages/TestePage'
import React from 'react';

function App() {
  const { data: dataFromBackend, loading } = useFetch('http://localhost:5000/api/test');
  const pages = ['home', 'menu', 'teste']


  const pageComponents = {
    home: HomePage,
    menu: MenuPage,
    teste: TestePage,
    // Add more entries as needed for other pages
  };

  return (
    <div className="App">
      <ResponsiveAppBar app_name={'OESK'} pages={pages} settings={['Profile', 'Account', 'Dashboard', 'Logout']} />
      <main>
        <Router>
          <Routes>
            {pages.map((page) => (
              <Route key={page} path={`/${page}`} element={React.createElement(pageComponents[page])} />
            ))}
          </Routes>

        </Router>
        {/* {dataFromBackend.message} */}
        <br />
        <Button>Ola Test</Button>
        <Button variant="contained">Contained</Button>

        BasicButtons

      </main>
    </div>
  );
}

export default App;
