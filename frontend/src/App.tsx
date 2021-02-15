import { useState } from 'react';
import TaskList from "./components/TaskList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import { TaskType } from "task.json";
import { blue, lightBlue } from "@material-ui/core/colors";
import {
  Container,
  makeStyles,
  Typography,
  fade,
} from '@material-ui/core';
import {
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/lab";
import {
  Schedule as ScheduleIcon,
  Check as CheckIcon
} from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  head: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  select: {
    minWidth: 120,
    marginBottom: theme.spacing(1.5)
  },
  toggleGroup: {
    marginBottom: theme.spacing(2)
  },
  toggleButton: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    "&.Mui-selected": {
      color: blue[500],
      backgroundColor: fade(blue[500], 0.1)
    },
    "&.Mui-selected:hover": {
      color: blue[500],
      backgroundColor: fade(blue[500], 0.16)
    }
  },
  icon: {
    marginRight: theme.spacing(0.5)
  }
}));

function App() {
  const taskJson = useSelector((state: RootState) => state.taskJson);
  const classes = useStyles();
  const [taskDialog, setTaskDialog] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>("todo");

  const handleTaskType = (_event: React.MouseEvent<HTMLElement>, newType: TaskType | null) => {
    if (newType)
      setTaskType(newType);
  };

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

        <ToggleButtonGroup
          value={taskType}
          onChange={handleTaskType}
          exclusive
          className={classes.toggleGroup}
        >
          <ToggleButton value="todo" className={classes.toggleButton}>
            <ScheduleIcon className={classes.icon} />
            todo
          </ToggleButton>
          <ToggleButton value="done" className={classes.toggleButton}>
            <CheckIcon className={classes.icon} />
            done
          </ToggleButton>
        </ToggleButtonGroup>

        <TaskList
          tasks={taskJson[taskType]}
          onAdd={() => setTaskDialog(true)}
        />
      </Container>
    </Layout>
  );
}

export default App;
