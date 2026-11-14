import './App.css'
import { useEffect, useState } from "react"
import Clock from "./components/Clock";
import WeatherCard from "./components/WeatherCard";
import TodoList from './components/TodoList';
import Greeting from './components/Greeting';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/weather")
      .then(res => res.json())
      .then(data => setWeather(data));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);
  // useState
  // useEffect
  // setInterval
  // clearInterval

  async function toggleTodo(id) {
    const res = await fetch(`http://localhost:8000/api/todos/${id}`, {
      method: "PATCH",
    });
    const updated = await res.json();
    setTodos(todos.map(t => (t.id === id ? updated : t)));
  }

  async function addTodo(title) {
    const res = await fetch("http://localhost:8000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const created = await res.json();
    setTodos([...todos, created]);
  }

  async function deleteTodo(id) {
    await fetch(`http://localhost:8000/api/todos/${id}`, { method: "DELETE" });
    // TODO: setTodos with the task whose id matches removed
    // Hint: .filter()
    setTodos(todos.filter(t => t.id !== id));
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Greeting name="Nathan" />
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-gray-800 rounded-2xl p-6 text-gray-400">
          <Clock />
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 text-gray-400">
          {weather && <WeatherCard weather={weather} />}
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 text-gray-400">
          <TodoList todos={todos} onToggle={toggleTodo} onAdd={addTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
}