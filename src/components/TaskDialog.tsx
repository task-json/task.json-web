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

import { computedState } from "../store/state";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogTitle, FormControl, InputLabel, MenuItem, Select, SxProps, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Signal, batch, effect, useSignal } from "@preact/signals";
import { Task } from "task.json";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { normalizeTask } from "../utils/task";

interface Props {
  open: Signal<boolean>,
  onConfirm: (task: Task) => any;
}

const inputStyle: SxProps = {
  mb: 2
};

export default function TaskDialog(props: Props) {
  const text = useSignal("");
  const priority = useSignal("");
  const due = useSignal<DateTime | null>(null);
  const projects = useSignal<string[]>([]);
  const contexts = useSignal<string[]>([]);

  const textError = useSignal(false);
  const dueError = useSignal(false);

  const validate = () => {
    if (text.value.length === 0) {
      textError.value = true;
      return false;
    }
    return due.value === null || !dueError.value;
  };
  const reset = () => {
    batch(() => {
      text.value = "";
      priority.value = "";
      due.value = null;
      projects.value = [];
      contexts.value = [];
      textError.value = false;
    })
  };
  const close = () => {
    props.open.value = false;
    reset();
  };
  const submit = () => {
    if (!validate()) {
      return false;
    }
    const date = new Date().toISOString();
    props.onConfirm(normalizeTask({
      id: uuidv4(),
      status: "todo",
      priority: priority.value,
      text: text.value,
      projects: projects.value,
      contexts: contexts.value,
      due: due.value ? due.value.toISO() : undefined,
      created: date,
      modified: date
    }));
    reset();
    return true;
  };
  const submitAndClose = () => {
    if (submit()) {
      props.open.value = false;
    }
  };

  return (
    <Dialog
      open={props.open.value}
      onKeyUp={(event: KeyboardEvent) => {
        // Submit on C-Enter and C-Shift-Enter
        if (event.ctrlKey && event.key === "Enter") {
          submitAndClose();
        }
        else if (event.shiftKey && event.key === "Enter") {
          submit();
        }
      }}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
    >
      <DialogTitle>Add Task</DialogTitle>
      <Box sx={{ display: "flex", flexDirection: "column", px: 3 }}>
        <TextField
          label="Text"
          autoFocus
          sx={inputStyle}
          required
          error={textError.value}
          value={text.value}
          onChange={(event: any) => text.value = event.target.value}
          onBlur={() => textError.value = text.value.length === 0}
        />
        <FormControl sx={inputStyle}>
          <InputLabel id="priority-select">Priority</InputLabel>
          <Select
            labelId="priority-select"
            label="Priority"
            value={priority.value}
            onChange={(event: any) => priority.value = event.target.value}
          >
            <MenuItem value={""}>
              None
            </MenuItem>
            {computedState.allPriorities.value.map(char => (
              <MenuItem value={char} key={char}>
                {char}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DateTimePicker
          label="Due"
          format="yyyy-MM-dd hh:mm:ss"
          ampm={false}
          sx={inputStyle}
          value={due.value}
          onChange={value => due.value = value}
          onError={err => dueError.value = err !== null}
          onAccept={() => dueError.value = false}
        />
        <Autocomplete
          multiple
          freeSolo
          sx={inputStyle}
          value={projects.value}
          onChange={(_, value) => projects.value = value}
          options={computedState.allProjects.value}
          renderInput={params => (
            <TextField {...params} label="Projects" />
          )}
        />
        <Autocomplete
          multiple
          freeSolo
          sx={inputStyle}
          value={contexts.value}
          onChange={(_, value) => contexts.value = value}
          options={computedState.allContexts.value}
          renderInput={params => (
            <TextField {...params} label="Contexts" />
          )}
        />
      </Box>
      <DialogActions>
        <Button color="inherit" onClick={close}>
          Cancel
        </Button>
        <Button color="error" onClick={reset}>
          Reset
        </Button>
        <Button onClick={submitAndClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
