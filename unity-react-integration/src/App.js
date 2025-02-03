import logo from './logo.svg';
import './App.css';
import UnityGame from './Components/UnityGame';
import ResultDisplay from './Components/ResultsDisplay';


function App() {
  return (
    <div className="App">
      <UnityGame/>
      <ResultDisplay/>
    </div>
  );
}

export default App;
