import { useState } from 'react';
import TaskList from "./components/TaskList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import {
  Container,
  makeStyles,
  Typography
} from '@material-ui/core';

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
  const taskJson = useSelector((state: RootState) => state.taskJson);
  const classes = useStyles();
  const [taskDialog, setTaskDialog] = useState(false);

  // TODO: add buttons to select task type
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

        <TaskList
          tasks={taskJson.todo}
          onAdd={() => setTaskDialog(true)}
        />
      </Container>
    </Layout>
  );
}

export default App;
