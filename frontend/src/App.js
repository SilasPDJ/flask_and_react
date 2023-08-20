import logo from './logo.svg';
import './App.css';
import useFetch from './hooks/useFetch';
import Button from '@mui/material/Button';


function App() {
  const { data: dataFromBackend, loading } = useFetch('http://localhost:5000/api/test');


  return (
    <div className="App">
      <header className="App-header">
        {/* {dataFromBackend.message} */}
        <br />
        <Button>Ola Test</Button>
        <Button variant="contained">Contained</Button>

        BasicButtons

      </header>
    </div>
  );
}

export default App;
