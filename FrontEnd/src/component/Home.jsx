import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [todos, setTodos] = useState([]); // Holds todos list
  const [error, setError] = useState(null); // Holds error message
  const [loading, setLoading] = useState(false); // Loading state
  const [newTodo, setNewTodo] = useState(""); // Input field state

  // ✅ FIX: fetch function name corrected (was "fetchtodos", now "fetchTodos")
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/todo/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.todos);
        setTodos(response.data.todos);
        setError(null);
      } catch (error) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // ✅ FIX: Added value & onChange to make input controlled
  const todoCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/todo/create",
        {
          text: newTodo,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );

      setTodos([...todos, response.data.newTodo]); // Append new todo to state
      setNewTodo(""); // Clear input field after adding
    } catch (error) {
      setError("Failed to create todo");
    }
  };

  // ✅ FIX: Accepts `id` as a parameter & finds correct todo
  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return; // Prevent errors if todo not found

    try {
      const response = await axios.put(
        `http://localhost:4001/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.todo);
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t))); // Update todo list
    } catch (error) {
      setError("Failed to update todo status");
    }
  };

  // ✅ FIX: Accepts `id` as a parameter & correctly removes the todo
  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id)); // Corrected filter logic
    } catch (error) {
      setError("Failed to delete todo");
    }
  };

  const navigateTo = useNavigate();
  // ✅ FIX: Added a function to handle logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4001/user/logout", {
        withCredentials: true,
      });
      toast.success("Logout Successfully");
      // <Navigate to={"/login"} />;
      navigateTo("/login"); // Redirect to login page after logouts
      localStorage.removeItem("jwt");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };
  // For Showing the remeaning todo count

  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  return (
    <div className="my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center my-5">Todo App</h1>

      {/* ✅ FIX: Added value & onChange to input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a New Todo"
          className="bg-white flex-grow p-2 rounded-l-md focus:outline-none"
          value={newTodo} // Controlled input
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && todoCreate()} // if i hit the enter button then automatically created the todo
        />
        <button
          onClick={todoCreate}
          className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300 cursor-pointer"
        >
          Add
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-2"></ul>
      )}

      {/* ✅ FIX: Used () instead of {} in map function to return JSX */}
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li
            key={todo._id || index}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
          >
            <div className="flex items-center">
              {/* ✅ FIX: Passed `todo._id` to onChange */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => todoStatus(todo._id)}
                className="mr-2 scale-120 cursor-pointer"
              />
              <span
                className={`${
                  todo.completed
                    ? "line-through text-gray-800 font-semibold"
                    : ""
                }`}
              >
                {todo.text}
              </span>
            </div>
            {/* ✅ FIX: Passed `todo._id` to onClick */}
            <button
              onClick={() => todoDelete(todo._id)}
              className="text-red-500 hover:text-red-700 cursor-pointer duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ✅ FIX: Displaying correct remaining todos */}
      <p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} todo(s) remaining
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 cursor-pointer mx-auto block"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
