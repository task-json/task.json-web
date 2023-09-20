import { useComputed, useSignal } from "@preact/signals";
import {
  CssBaseline,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  createTheme,
  useMediaQuery,
  Container,
  Box,
  SxProps
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { TaskStatus } from "task.json";
import { state } from "./store/state";
import Layout from "./components/Layout";
import Icon from "@mdi/react";
import { mdiCheck, mdiClockOutline, mdiDelete } from "@mdi/js";
import TaskList from "./components/TaskList";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

const toggleButtonStyle: SxProps = {
  px: 2.5,
  "&:not(.Mui-selected)": {
    opacity: 0.7
  }
};

export default function App() {
  const theme = useComputed(() => {
    const dark = state.settings.value.dark;
    return createTheme({
      palette: {
        mode: dark ? "dark" : "light",
        primary: {
          main: blue[500],
          contrastText: "#fff"
        },
        secondary: {
          main: green[500],
          contrastText: "#fff"
        }
      },
    });
  });
  const isSmallDevice = useMediaQuery(theme.value.breakpoints.down("xs"));
  const taskStatus = useSignal<TaskStatus>("todo");

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme.value}>
        <CssBaseline />
        <Layout>
          <Container>
            <Typography sx={{ mb: 2 }} variant="h5">
              Tasks
            </Typography>

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

            <TaskList />
          </Container>
        </Layout>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

