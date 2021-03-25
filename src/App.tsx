import { useState } from 'react';
import TaskList from "./components/TaskList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { Task, TaskType } from "task.json";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import {
  Container,
  makeStyles,
  Typography,
  fade,
  CssBaseline,
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core';
import {
  ToggleButton,
  ToggleButtonGroup
} from "@material-ui/lab";
import {
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Delete as DeleteIcon
} from "@material-ui/icons"
import { green, blue } from '@material-ui/core/colors';

const createTheme = (dark: boolean) => createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      contrastText: "#fff"
    },
    secondary: {
      main: green[500],
      contrastText: "#fff"
    },
    type: dark ? "dark" : "light"
  }
});

const useStyles = makeStyles(theme => ({
  head: {
    marginBottom: theme.spacing(2)
  },
  select: {
    minWidth: 120,
    marginBottom: theme.spacing(1.5)
  },
  toggleGroup: {
    marginBottom: theme.spacing(2),
    flexWrap: "wrap"
  },
  toggleButton: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    "&.Mui-selected": {
      color: blue[500],
      backgroundColor: fade(blue[500], 0.12)
    },
    "&.Mui-selected:hover": {
      color: blue[500],
      backgroundColor: fade(blue[500], 0.18)
    }
  },
  icon: {
    marginRight: theme.spacing(0.5)
  }
}));

function App() {
  const dark = useSelector((state: RootState) => state.settings.dark);
  const theme = createTheme(dark);
  const classes = useStyles();
  const [taskDialog, setTaskDialog] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>("todo");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleTaskType = (_event: React.MouseEvent<HTMLElement>, newType: TaskType | null) => {
    if (newType)
      setTaskType(newType);
  };
  const handleDialogClose = () => {
    setTaskDialog(false);
    setCurrentTask(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <TaskDialog
          open={taskDialog}
          onClose={handleDialogClose}
          task={currentTask}
          taskType={taskType}
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
            <ToggleButton value="removed" className={classes.toggleButton}>
              <DeleteIcon className={classes.icon} />
              removed
            </ToggleButton>
          </ToggleButtonGroup>

          <TaskList
            taskType={taskType}
            onAdd={() => setTaskDialog(true)}
            onEdit={task => {
              setCurrentTask(task);
              setTaskDialog(true);
            }}
          />
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
