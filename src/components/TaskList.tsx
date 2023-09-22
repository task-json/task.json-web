import Icon from "@mdi/react";
import { state } from "../store/state";
import {
  useMediaQuery,
  SxProps,
  Box,
  Card,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Theme
} from "@mui/material";
import { batch, useComputed, useSignal } from "@preact/signals";
import { ColDef, RowClassParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { mdiCheck, mdiClockOutline, mdiDelete, mdiEraserVariant, mdiPlus, mdiRestore } from "@mdi/js";
import TaskDialog from "./TaskDialog";
import { Task, TaskStatus, taskUrgency } from "task.json";
import { useRef } from "preact/hooks";
import { CSSProperties } from "preact/compat";
import { amber, cyan, red } from "@mui/material/colors";
import { DateTime, DurationObjectUnits } from "luxon";

function showDate(date: DateTime) {
	type Unit = keyof DurationObjectUnits;
	const units: Unit[] = ["years", "months", "days", "hours", "minutes", "seconds"];
	const shortUnit = (unit: Unit) => {
		let short = unit.charAt(0);
		if (short === "m" && unit === "months")
			short = "M";
		return short;
	};

	const duration = date.diffNow(units);
	for (const unit of units) {
		const value = duration[unit];
		if (value < 0)
			return "x";
		if (value > 0) {
			if (unit === "seconds")
				return "<1m";
			return `${value}${shortUnit(unit)}`;
		}
	}

	return "x";
}

const defaultColDef: ColDef<Task> = {
  resizable: true,
  sortable: true,
  filter: true,
};

const columnDefs: ColDef<Task>[] = [
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
    field: "due",
    valueFormatter: params => params.data.due && showDate(DateTime.fromISO(params.data.due))
  }
];

const toggleButtonStyle: SxProps = {
  px: 2.5,
  "&:not(.Mui-selected)": {
    opacity: 0.7
  }
};

export default function TaskList() {
  const agTheme = useComputed(() => (
    state.settings.value.dark
      ? "ag-theme-alpine-dark"
      : "ag-theme-alpine"
  ));
  const isSmallDevice = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const taskStatus = useSignal<TaskStatus>("todo");
  const gridRef = useRef<AgGridReact<Task>>();
  const taskDialog = useSignal(false);
  const selectedTasks = useSignal<Task[]>([]);
  const getSelectedIds = () => {
    return selectedTasks.value.reduce(
      (acc, t) => acc.add(t.id),
      new Set<string>()
    );
  };

  const currentTasks = useComputed(() => (
    state.taskJson.value.filter(t => t.status === taskStatus.value)
  ));

  const onSelectionChanged = () => {
    selectedTasks.value = gridRef.current.api.getSelectedRows();
  };
  const addTask = (task: Task) => {
    state.taskJson.value = [...state.taskJson.value, task];
  };
  const eraseSelected = () => {
    const ids = getSelectedIds();
    batch(() => {
      selectedTasks.value = [];
      state.taskJson.value = state.taskJson.value.filter(t => !ids.has(t.id));
    });
  };
  const eraseAction = () => {
    state.confirmation.onConfirm = eraseSelected;
    batch(() => {
      state.confirmation.open.value = true;
      state.confirmation.text.value = "Warning: This will permanently erase the tasks. Make sure they are not on the sync server. Confirm to erase?";
    });
  };
  const updateSelectedStatus = (status: TaskStatus) => {
    const ids = getSelectedIds();
    batch(() => {
      selectedTasks.value = [];
      state.taskJson.value = state.taskJson.value.map(t => (
        ids.has(t.id)
          ? { ...t, status }
          : t
      ));
    });
  };

  // highlight urgent tasks
  const getRowStyle = useComputed(() => {
    const dark = state.settings.value.dark;
    return (params: RowClassParams<Task>): CSSProperties => {
      const task = params.data;
      // Only color todo tasks
      if (task.status !== "todo")
      return undefined;

      const urg = taskUrgency(task);
      const color = (
        urg >= 1000
          ? red[500]
          : urg >= 100
            ? (dark ? amber[600] : amber[800])
            : urg >= 1
              ? (dark ? cyan[400] : cyan[600])
              : undefined
      );

      return color && {
        fontWeight: 500,
        color
      };
    };
  });


  return (
    <>
      <ToggleButtonGroup
        value={taskStatus.value}
        onChange={(_, value) => value && (taskStatus.value = value)}
        exclusive
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <ToggleButton value="todo" sx={toggleButtonStyle} color="primary">
          <Icon path={mdiClockOutline} size={1} />
          <Box sx={{ ml: 0.5 }}>
            {isSmallDevice || "todo"}
          </Box>
        </ToggleButton>
        <ToggleButton value="done" sx={toggleButtonStyle} color="primary">
          <Icon path={mdiCheck} size={1} />
          <Box sx={{ ml: 0.5 }}>
            {isSmallDevice || "done"}
          </Box>
        </ToggleButton>
        <ToggleButton value="removed" sx={toggleButtonStyle} color="primary">
          <Icon path={mdiDelete} size={1} />
          <Box sx={{ ml: 0.5 }}>
            {isSmallDevice || "removed"}
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      <Card>
        <Box sx={{
          display: "flex",
          flexDirection: "row-reverse",
          p: 0.5
        }}>
          <IconButton
            color="primary"
            size="small"
            title="Add"
            onClick={() => taskDialog.value = true}
          >
            <Icon path={mdiPlus} size={1.25} />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            title="Erase"
            sx={{
              display: taskStatus.value === "removed" && selectedTasks.value.length > 0
                ? undefined
                : "none"
            }}
            onClick={eraseAction}
          >
            <Icon path={mdiEraserVariant} size={1.25} />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            title="Delete"
            sx={{
              display: taskStatus.value !== "removed" && selectedTasks.value.length > 0
                ? undefined
                : "none"
            }}
            onClick={() => updateSelectedStatus("removed")}
          >
            <Icon path={mdiDelete} size={1.25} />
          </IconButton>
          <IconButton
            color="success"
            size="small"
            title="Do"
            sx={{
              display: taskStatus.value === "todo" && selectedTasks.value.length > 0
                ? undefined
                : "none"
            }}
            onClick={() => updateSelectedStatus("done")}
          >
            <Icon path={mdiCheck} size={1.25} />
          </IconButton>
          <IconButton
            color="success"
            size="small"
            title="Undo"
            sx={{
              display: taskStatus.value === "done" && selectedTasks.value.length > 0
                ? undefined
                : "none"
            }}
            onClick={() => updateSelectedStatus("todo")}
          >
            <Icon path={mdiRestore} size={1.25} />
          </IconButton>
        </Box>

        <Box className={agTheme.value}>
          {/* use autoHeight with pagination for auto height based on page size */}
          <AgGridReact
            ref={gridRef}
            pagination={true}
            paginationPageSize={5}
            domLayout="autoHeight"
            rowData={currentTasks.value}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            getRowStyle={getRowStyle.value}
          />
        </Box>

        <TaskDialog open={taskDialog} onConfirm={addTask} />
      </Card>
    </>
  );
}
