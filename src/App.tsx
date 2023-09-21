import { useComputed } from "@preact/signals";
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  Container,
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { state } from "./store/state";
import Layout from "./components/Layout";
import TaskList from "./components/TaskList";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

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

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme.value}>
        <CssBaseline />
        <Layout>
          <Container>
            <Typography sx={{ mb: 2 }} variant="h5">
              Tasks
            </Typography>

            <TaskList />
          </Container>

          <ConfirmationDialog />
        </Layout>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

