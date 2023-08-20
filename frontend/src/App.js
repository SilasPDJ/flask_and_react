import logo from './logo.svg';
import './App.css';
import useFetch from './hooks/useFetch';
import Button from '@mui/material/Button';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';


function App() {
  const { data: dataFromBackend, loading } = useFetch('http://localhost:5000/api/test');


  return (
    <div className="App">
      <ResponsiveAppBar />
      <main className="App-header">
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
