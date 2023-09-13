import { useContext } from "preact/hooks";
import { state } from "./store/state";
import { useComputed } from "@preact/signals";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";

export default function App() {
  const theme = useComputed(() => {
    const dark = state.settings.value.dark;
    return createTheme({
      palette: {
        mode: dark ? "dark" : "light"
      }
    });
  });

	return (
    <ThemeProvider theme={theme.value}>
      <CssBaseline />
      <Layout>
        <h1>Vite + Preact</h1>
        <div class="card">
          <p>
            Edit <code>src/app.jsx</code> and save to test HMR
          </p>
        </div>
        <p class="read-the-docs">Click on the Vite and Preact logos to learn more</p>
      </Layout>
    </ThemeProvider>
	);
}

