// Copyright (C) 2023  DCsunset

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
  Theme
} from "@mui/material";
import FileSaver from "file-saver";
import { deserializeTaskJson, serializeTaskJson } from "task.json";
import { state } from "../store/state";
import { useComputed, useSignal, batch, Signal } from "@preact/signals";
import Icon from '@mdi/react';
import { mdiCloudDownload, mdiCloudUpload, mdiDelete, mdiImport, mdiExport, mdiSync } from "@mdi/js";
import { login, logout, syncTasks, uploadTasks, downloadTasks } from "../store/actions";

interface Props {
  open: Signal<boolean>
}

const validNumber = (value: string, min: number, max: number) => {
  if (value.length === 0) {
    return false;
  }
  const num = parseInt(value);
  return num >= min && num <= max;
};

function SettingsDialog(props: Props) {
  const isSmallDevice = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const settings = useComputed(() => state.settings.value);

  // Local states
  const pageSize = useSignal(settings.value.pageSize.toString());
  const maxPriorities = useSignal(settings.value.maxPriorities.toString());
  const server = useSignal(settings.value.server ?? "");
  const serverExists = useComputed(() => server.value.length > 0);
  const password = useSignal("");

  const pageSizeError = useSignal(false);
  const priorityError = useSignal(false);

  // reset local states
  const reset = () => {
    batch(() => {
      maxPriorities.value = settings.value.maxPriorities.toString();
      password.value = "";
      server.value = settings.value.server ?? "";
      priorityError.value = false;
    })
  };

  const close = () => {
    props.open.value = false;
    reset();
  };

  const save = () => {
    if (!priorityError.value && !pageSizeError.value) {
      batch(() => {
        state.settings.value = {
          ...settings.value,
          maxPriorities: parseInt(maxPriorities.value),
          pageSize: parseInt(pageSize.value),
          server: serverExists.value ? server.value : undefined
        };
        props.open.value = false;
      });
    }
  };

  const importData = (files: FileList | null) => {
    if (!files?.length)
      return;

    const reader = new FileReader();
    reader.onload = () => {
      const taskJson = deserializeTaskJson(reader.result as string);
      state.taskJson.value = taskJson;
      state.notifications.value = [
        ...state.notifications.value,
        {
          id: new Date().toISOString(),
          color: "success",
          text: "Data imported successfully"
        }
      ];
    };
    reader.readAsText(files[0]);
  };

  const exportData = () => {
    const blob = new Blob([
      serializeTaskJson(state.taskJson.value)
    ], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "task.json");
  };

  const clearData = () => {
    batch(() => {
      state.taskJson.value = [];
      state.notifications.value = [
        ...state.notifications.value,
        {
          id: new Date().toISOString(),
          color: "success",
          text: "Successfully cleared data"
        }
      ];
    });
  };

  const clearAction = () => {
    state.confirmation.onConfirm = clearData;
    batch(() => {
      state.confirmation.open.value = true;
      state.confirmation.text.value = "Warning: This will clear all the data in the local storage. Are you sure to clear?";
    });
  };

  // TODO: add actions
  const loginAction = async () => {
    await login(server.value, password.value);
  }

  return (
    <Dialog
      open={props.open.value}
      onClose={() => props.open.value = false}
      disableBackdropClick
      fullWidth
    >
      <DialogTitle sx={{ pb: 0 }}>Settings</DialogTitle>
      <DialogContent sx={{ px: isSmallDevice ? 1 : 0 }}>
        <List>
          <Box sx={{ mx: 2, mt: 2 }}>
            <Typography color="textSecondary" sx={{ mb: 0.5 }}>
              General
            </Typography>
            <Divider />
          </Box>

          <ListItem>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <ListItemText secondary={
                  <span>
                    positive integer
                  </span>
                }>
                  Number of tasks per page
                </ListItemText>
              </Grid>
              <Grid item>
                <TextField
                  variant="standard"
                  type="number"
                  sx={{ maxWidth: "45px" }}
                  error={pageSizeError.value}
                  value={pageSize.value}
                  onChange={(event: any) => {
                    const value = event.target.value;
                    pageSizeError.value = !validNumber(value, 1, 26);
                    pageSize.value = value;
                  }}
                />
              </Grid>
            </Grid>
          </ListItem>

          <ListItem>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <ListItemText secondary={
                  <span>
                    between 1 and 26
                    (start from <b>A</b>)
                  </span>
                }>
                  Max number of priorities
                </ListItemText>
              </Grid>
              <Grid item>
                <TextField
                  variant="standard"
                  type="number"
                  sx={{ maxWidth: "45px" }}
                  error={priorityError.value}
                  value={maxPriorities.value}
                  onChange={(event: any) => {
                    const value = event.target.value;
                    priorityError.value = !validNumber(value, 1, 26);
                    maxPriorities.value = value;
                  }}
                />
              </Grid>
            </Grid>
          </ListItem>

          <ListItem>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <ListItemText secondary="task.json">
                  JSON data
                </ListItemText>
              </Grid>
              <Grid item>
                <IconButton
                  color="success"
                  sx={{ ml: 1 }}
                  onClick={exportData}
                  title="Export"
                >
                  <Icon path={mdiExport} size={1} />
                </IconButton>
                <input
                  id="import-data-input"
                  style={{ display: "none" }}
                  type="file"
                  onChange={event => importData(event.target.files)}
                />
                <label htmlFor="import-data-input">
                  <IconButton
                    color="primary"
                    sx={{ ml: 1 }}
                    component="span"
                    title="Import"
                  >
                    <Icon path={mdiImport} size={1} />
                  </IconButton>
                </label>
                <IconButton
                  color="error"
                  sx={{ ml: 1 }}
                  title="Clear"
                  onClick={clearAction}
                >
                  <Icon path={mdiDelete} size={1} />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>

          <Box sx={{ mx: 2, mt: 2 }}>
            <Typography color="textSecondary" sx={{ mb: 0.5 }}>
              Server
            </Typography>
            <Divider />
          </Box>

          <ListItem>
            <Grid container sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Grid item>
                <ListItemText secondary="task.json-server">
                  Server
                </ListItemText>
              </Grid>
              <Grid item>
                <TextField
                  variant="standard"
                  label="Server URL"
                  value={server.value}
                  onChange={event => server.value = event.target.value}
                />
              </Grid>
            </Grid>
          </ListItem>

          <ListItem>
            <Grid container sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Grid item>
                <ListItemText secondary={state.loggedIn.value ? "already logged in" : "not logged in"}>
                  Session
                </ListItemText>
              </Grid>
              <Grid item style={{
                display: "flex",
                alignItems: "center"
              }}>
                {!state.loggedIn.value && (
                  <>
                    <TextField
                      variant="standard"
                      type="password"
                      sx={{ maxWidth: "200px", ml: 1 }}
                      label="password"
                      value={password.value}
                      disabled={!serverExists.value}
                      onChange={event => password.value = event.target.value}
                    />
                    <Button
                      color="primary"
                      size="small"
                      disabled={!serverExists.value || password.value.length === 0}
                      onClick={loginAction}
                    >
                      Log in
                    </Button>
                  </>
                )}
                {state.loggedIn.value &&
                  <Button
                    size="small"
                    color="error"
                    onClick={logout}
                  >
                    Log out
                  </Button>
                }
              </Grid>
            </Grid>
          </ListItem>

          <ListItem>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <ListItemText>
                  Sync
                </ListItemText>
              </Grid>
              <Grid item>
                <IconButton
                  color="secondary"
                  sx={{ ml: 1 }}
                  onClick={syncTasks}
                  disabled={!state.loggedIn.value}
                  title="Sync"
                >
                  <Icon path={mdiSync} size={1} />
                </IconButton>
                <IconButton
                  color="primary"
                  sx={{ ml: 1 }}
                  onClick={uploadTasks}
                  disabled={!state.loggedIn.value}
                  title="Upload"
                >
                  <Icon path={mdiCloudUpload} size={1} />
                </IconButton>
                <IconButton
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={downloadTasks}
                  disabled={!state.loggedIn.value}
                  title="Download"
                >
                  <Icon path={mdiCloudDownload} size={1} />
                </IconButton>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={close}>Cancel</Button>
        <Button color="error" onClick={reset}>Reset</Button>
        <Button color="primary" onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;
