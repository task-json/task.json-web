import { useComputed } from "@preact/signals";
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  Box,
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
        mode: dark ? "dark" : "light"
      },
    });
  });

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ThemeProvider theme={theme.value}>
        <CssBaseline />
        <Layout>
          <Box sx={{
            maxWidth: {
              lg: "90%",
              // 90% of xl breakpoints 1536px
              xl: "1382px"
            },
            px: {
              xs: 2,
              md: 4
            },
            margin: "auto"
          }}>
            <Typography sx={{ mb: 2 }} variant="h5">
              Tasks
            </Typography>

            <TaskList />
          </Box>
          <ConfirmationDialog />
        </Layout>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

