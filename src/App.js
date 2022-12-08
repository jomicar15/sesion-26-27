import './App.css';
import TaskList from './components/container/TaskList';

function App() {
  return (
    <div className="App">
        <h1>Creador de tareas con useContext y useReducer</h1>
        <TaskList/>
    </div>
  );
}

export default App;
