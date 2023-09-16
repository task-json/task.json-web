import { state } from "../store/state";
import { Box } from "@mui/material";
import { useComputed } from "@preact/signals";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

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
  const data = [
    { priority: "A", text: "Hello", projects: ["a", "b"] },
    { priority: "B", text: "Hello 2", projects: ["a"] },
    { priority: "C", text: "Hello 2" },
    { priority: "C", text: "Hello 2" },
    { priority: "C", text: "Hello 2" },
    { priority: "C", text: "Hello 2" },
    { priority: "C", text: "Hello 2" },
    { priority: "C", text: "Hello 2" },
  ];

  const agTheme = useComputed(() => (
    state.settings.value.dark
      ? "ag-theme-alpine-dark"
      : "ag-theme-alpine"
  ));

  return (
    <Box className={agTheme.value}>
      {/* use autoHeight with pagination for auto height based on page size */}
      <AgGridReact
        pagination={true}
        paginationPageSize={5}
        domLayout="autoHeight"
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
      />
    </Box>
  )
}
