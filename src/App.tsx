import React, {
  useState,
} from "react";
import "./App.css";

const catIcon = require("./cat-icon.png");
const dogIcon = require("./dog-icon.png");

function useLocalStorage(key: any, initialValue: any): any {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

function App() {
  const [task, setTask] = useState("")
  const [taskList, setTaskList] = useLocalStorage("Task List", []);

  
  const HandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // spread operator 
    setTaskList([...taskList, task]);
    setTask("");
  };
  
  return (
    <div className="App">
      <main> 
      <header> To-Do List App
      <img src={dogIcon} alt="cat icon" width="15%" className="icon"/>
      <form id="new-task-form" onSubmit={HandleSubmit}>
        <input
          type="text"
          name = "new-task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          />
        <input id = "new-task-submit" type="submit" value="Add Task" />
      </form>
      </header>
      </main>

      

      <h2>Tasks</h2>
      <ul>
        {taskList.map((task: any, index: any) => (
          <li key={index}>
            <img src={catIcon} alt="cat icon" width="20%"/>
            {task}{" "}
            <button
              onClick={
                (event) =>
                setTaskList(
                  taskList.filter((_: any, i: number) => i !== index)
                  )
                  // setTaskList(taskList.splice(index, 1))
                }
                >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
