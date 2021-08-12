import React, { useEffect } from "react";
import TodoList from "./components/TodoList";

function App() {
  useEffect(() => {
    // socket.emit("add", "message");
  }, []);
  return (
    <div>
      <TodoList />
    </div>
  );
}

export default App;
