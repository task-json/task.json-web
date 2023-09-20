import { state, computedState } from "../store/state";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SxProps, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Signal, batch, useSignal } from "@preact/signals";
import { Task } from "task.json";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

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

  const reset = () => {
    batch(() => {
      text.value = "";
      priority.value = "";
      due.value = null;
      projects.value = [];
      contexts.value = [];
    })
  };
  const close = () => {
    props.open.value = false;
    reset();
  };
  const confirm = () => {
    const date = new Date().toISOString();
    props.onConfirm({
      id: uuidv4(),
      status: "todo",
      text: text.value,
      projects: projects.value.length ? projects.value : undefined,
      contexts: contexts.value.length ? projects.value : undefined,
      created: date,
      modified: date
    });
    close();
  };

  return (
    <Dialog
      open={props.open.value}
      onClose={close}
    >
      <DialogTitle>Add Task</DialogTitle>
      <Box sx={{ display: "flex", flexDirection: "column", px: 3 }}>
        <TextField
          label="Text"
          sx={inputStyle}
          required
          value={text.value}
          onChange={(event: any) => text.value = event.target.value}
          autoFocus
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
        <DatePicker
          label="Due"
          format="yyyy-MM-dd"
          sx={inputStyle}
          value={due.value}
          onChange={value => due.value = value}
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
        <Button onClick={confirm}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
