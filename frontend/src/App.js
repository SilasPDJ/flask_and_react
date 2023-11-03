import logo from './logo.svg';
import './App.css';

import useFetch from './components/layout/Form/hooks/useFetch';
import postData from './components/layout/Form/helpers/postData';
import Button from '@mui/material/Button';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// pages
import HomePage from './components/pages/homePage';
import MenuPage from './components/pages/menuPage';
import TestePage from './components/pages/testPage'
import ClientsPage from './components/pages/clientsPage';
import CompetenciasPage from './components/pages/competenciasPage';

import React, { useEffect, useState } from 'react';


function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  // const clientsCompt = Array.from(Object.values(useFetch('clients_compt')));
  // the key is the page name, and the value is the component
  const pageComponents = {
    Home: HomePage,
    Competencias: CompetenciasPage,
    "Clients_Register": ClientsPage,
    Menu: MenuPage,
    Teste: TestePage,
  };

  const PAGES = Object.keys(pageComponents);


  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App" >
        <ResponsiveAppBar project_name={'OESK'} pages={PAGES} settings={['Profile', 'Account', 'Dashboard', 'Logout']} />
        <main>
          <Router>
            <Routes>
              {PAGES.map((page) => (
                <Route key={page} path={`/${page}`} element={React.createElement(pageComponents[page])} />
              ))}
            </Routes>

          </Router>

          {/* {clientsCompt} */}

        </main>
      </div>
    </ThemeProvider >
  );
}

export default App;
