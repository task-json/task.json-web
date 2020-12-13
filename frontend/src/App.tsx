import { useState } from 'react';
import TodoList from "./components/TodoList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import {
  Container,
  makeStyles,
  Typography
} from '@material-ui/core';
import { parseTasks } from './utils/tasks';

const useStyles = makeStyles(theme => ({
  head: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  select: {
    minWidth: 120,
    marginBottom: theme.spacing(1.5)
  },
}));

function App() {
  const tasks = useSelector((state: RootState) => parseTasks(state.tasks));
  const classes = useStyles();
  const [taskDialog, setTaskDialog] = useState(false);

  return (
    <Layout>
      <TaskDialog
        open={taskDialog}
        onClose={() => setTaskDialog(false)}
      />

      <Container>
        <Typography className={classes.head} variant="h5">
          Tasks
        </Typography>

        <TodoList
          data={tasks}
          onAdd={() => setTaskDialog(true)}
        />
      </Container>
    </Layout>
  );
}

export default App;
