import Icon from "@mdi/react";
import { state } from "../store/state";
import { Box, Card, IconButton, Toolbar } from "@mui/material";
import { batch, useComputed, useSignal } from "@preact/signals";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { mdiDelete, mdiPlus } from "@mdi/js";
import TaskDialog from "./TaskDialog";
import { Task } from "task.json";
import { useRef } from "preact/hooks";

const defaultColDef: ColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  // checkboxSelection: true,
};

const columnDefs: ColDef[] = [
  {
    field: "priority",
    headerName: "P",
    checkboxSelection: true,
    headerCheckboxSelection: true
  },
  {
    field: "text",
    flex: 1
  },
  {
    field: "projects",
    headerName: "Proj"
  },
  {
    field: "contexts",
    headerName: "Ctx"
  },
  {
    field: "due"
  }
]

export default function TaskList() {
  const agTheme = useComputed(() => (
    state.settings.value.dark
      ? "ag-theme-alpine-dark"
      : "ag-theme-alpine"
  ));
  const gridRef = useRef<AgGridReact<Task>>();
  const taskDialog = useSignal(false);
  const selectedTasks = useSignal<Task[]>([]);

  const onSelectionChanged = () => {
    selectedTasks.value = gridRef.current.api.getSelectedRows();
  };
  const addTask = (task: Task) => {
    state.taskJson.value = [...state.taskJson.value, task];
  };
  const deleteTasks = () => {
    const deletedIds = selectedTasks.value.reduce(
      (acc, t) => acc.add(t.id),
      new Set<string>()
    );
    batch(() => {
      selectedTasks.value = [];
      state.taskJson.value = state.taskJson.value.filter(t => !deletedIds.has(t.id));
    });
  };

  return (
    <Card>
      <Box sx={{
        display: "flex",
        flexDirection: "row-reverse",
        p: 0.5
      }}>
        <IconButton
          color="success"
          size="small"
          title="Add"
          onClick={() => taskDialog.value = true}
        >
          <Icon path={mdiPlus} size={1.25} />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          title="Delete"
          sx={{ display: selectedTasks.value.length > 0 ? undefined : "none" }}
          onClick={deleteTasks}
        >
          <Icon path={mdiDelete} size={1.25} />
        </IconButton>
      </Box>

      <Box className={agTheme.value}>
        {/* use autoHeight with pagination for auto height based on page size */}
        <AgGridReact
          ref={gridRef}
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
          rowData={state.taskJson.value}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </Box>

      <TaskDialog open={taskDialog} onConfirm={addTask} />
    </Card>
  )
}
