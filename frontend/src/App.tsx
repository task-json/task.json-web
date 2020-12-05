import React from 'react';
import TodoList from "./components/TodoList";
import Layout from "./components/Layout";
import { Column } from 'material-table';
import { useSelector } from 'react-redux';
import { RootState } from "./store";

function App() {
  const rootState = useSelector((state: RootState) => state);

  const columns: Column<object>[] = [
    { title: "Projects", field: "projects" },
    { title: "Text", field: "text" },
    { title: "Date", field: "date" }
  ];
  const tasks = rootState.tasks;

  return (
    <Layout>
      <TodoList
        columns={columns}
        data={tasks}
      />
    </Layout>
  );
}

export default App;
