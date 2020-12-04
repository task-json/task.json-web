import React from 'react';
import TodoList from "./components/TodoList";
import { Column } from 'material-table';

function App() {
  const columns: Column<object>[] = [
    { title: "Projects", field: "projects" },
    { title: "Text", field: "text" },
    { title: "Date", field: "date" }
  ];

  const todoItems: any[] = [];

  return (
    <div className="App">
      <TodoList
        columns={columns}
        data={todoItems}
      />
    </div>
  );
}

export default App;
