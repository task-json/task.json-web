import React, { Fragment, useState } from 'react';
import TodoList from "./components/TodoList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import { Container, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { Autocomplete } from "@material-ui/lab";
import { getContexts, getProjects, parseTasks } from './utils/tasks';
import _ from "lodash";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  head: {
    paddingTop: theme.spacing(3)
  },
  select: {
    minWidth: 120,
    marginBottom: theme.spacing(1.5)
  },
  chevron: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

type View = "Tasks" | "Projects" | "Contexts";

function App() {
  const tasks = useSelector((state: RootState) => parseTasks(state.tasks));
  const classes = useStyles();
  const [view, setView] = useState("Tasks" as View);
  const [taskDialog, setTaskDialog] = useState(false);

  const [projects, setProjects] = useState([] as string[]);
  const [contexts, setContexts] = useState([] as string[]);
  const allProjects = getProjects(tasks);
  const allContexts = getContexts(tasks);

  const filteredTasks = tasks.filter(task => {
    if (view === "Tasks") {
      return true;
    }
    else if (view === "Projects") {
      return _.intersection(
        task.projects,
        projects
      ).length === projects.length;
    }
    else {
      return _.intersection(
        task.contexts,
        contexts
      ).length === contexts.length;
    }
  });

  const TaskFilter = () => {
    if (view === "Projects") {
      return (
        <Autocomplete
          multiple
          className={classes.select}
          value={projects}
					onChange={(_, value) => setProjects(value)}
          options={[...allProjects]}
          renderInput={params => (
            <TextField {...params} label="Projects" />
          )}
        />
      );
    }
    else if (view === "Contexts") {
      return (
        <Autocomplete
          multiple
          className={classes.select}
          options={[...allContexts]}
          value={contexts}
					onChange={(_, value) => setContexts(value)}
          renderInput={params => (
            <TextField {...params} label="Contexts" />
          )}
        />
      );
    }
    else {
      return <Fragment />;
    }
  }

  return (
    <Layout>
      <TaskDialog
        open={taskDialog}
        onClose={() => setTaskDialog(false)}
      />

      <Container>
        <Grid container alignItems="center" className={classes.head}>
          <Grid item className={classes.title}>
            <Grid container alignItems="center">
              <Typography variant="h5">
                {view}
              </Typography>
              {view !== "Tasks" && (
                <Fragment>
                  <ChevronRight className={classes.chevron} />
                  <TaskFilter />
                </Fragment>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <FormControl className={classes.select}>
              <InputLabel id="view-select-label">View</InputLabel>
              <Select
                labelId="view-select-label"
                value={view}
                onChange={event => setView(event.target.value as View)}
              >
                <MenuItem value="Tasks">Tasks</MenuItem>
                <MenuItem value="Projects">Projects</MenuItem>
                <MenuItem value="Contexts">Contexts</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TodoList
          data={filteredTasks}
          onAdd={() => setTaskDialog(true)}
        />
      </Container>
    </Layout>
  );
}

export default App;
