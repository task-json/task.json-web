import Icon from "@mdi/react";
import { state } from "../store/state";
import { Box, Card, IconButton, Toolbar } from "@mui/material";
import { useComputed, useSignal } from "@preact/signals";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { mdiDelete, mdiPlus } from "@mdi/js";
import TaskDialog from "./TaskDialog";
import { Task } from "task.json";

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
  const taskDialog = useSignal(false);
  const addTask = (task: Task) => {
    state.taskJson.value = [...state.taskJson.value, task];
  };

  return (
    <Card>
      <Box sx={{
        display: "flex",
        flexDirection: "row-reverse",
      }}>
        <IconButton color="success" onClick={() => taskDialog.value = true}>
          <Icon path={mdiPlus} size={1.4} />
        </IconButton>
      </Box>
      <Box className={agTheme.value}>
        {/* use autoHeight with pagination for auto height based on page size */}
        <AgGridReact
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
          rowData={state.taskJson.value}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
        />
      </Box>

      <TaskDialog open={taskDialog} onConfirm={addTask} />
    </Card>
  )
}
