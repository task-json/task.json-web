import React, { Fragment, useState } from 'react';
import TodoList from "./components/TodoList";
import Layout from "./components/Layout";
import TaskDialog from "./components/TaskDialog";
import { useSelector } from 'react-redux';
import { RootState } from "./store";
import { Container, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { Autocomplete } from "@material-ui/lab";
import { getProjects } from './utils/tasks';

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

function App() {
  const rootState = useSelector((state: RootState) => state);
  const classes = useStyles();
  const [view, setView] = useState("Tasks");
  const [taskDialog, setTaskDialog] = useState(false);

  const tasks = rootState.tasks;
  const projects = getProjects(tasks);

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
              {view === "Projects" && (
                <Fragment>
                  <ChevronRight className={classes.chevron} />
                  <Autocomplete
                    className={classes.select}
                    options={[...projects]}
                    renderInput={params => (
                      <TextField {...params} label="Project" />
                    )}
                  />
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
                onChange={event => setView(event.target.value as string)}
              >
                <MenuItem value="Tasks">Tasks</MenuItem>
                <MenuItem value="Projects">Projects</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TodoList
          data={tasks}
          onAdd={() => setTaskDialog(true)}
        />
      </Container>
    </Layout>
  );
}

export default App;
