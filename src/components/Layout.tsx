import { state } from "../store/state";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import { blue } from "@mui/material/colors";
import Icon from '@mdi/react';
import { mdiStickerCheckOutline, mdiBrightness4, mdiBrightness7, mdiCog } from '@mdi/js';
import { signal, useComputed } from "@preact/signals";
import SettingsDialog from "./SettingsDialog";


interface Props {
	children?: any;
};

export default function Layout(props: Props) {
  const dark = useComputed(() => state.settings.value.dark);

  const settingsDialog = signal(false);

  const toggleTheme = () => {
    state.settings.value = {
      ...state.settings.value,
      dark: !dark.value
    };
  };

  return (
    <>
      {/* Disable backgroundImage to avoid color change in dark theme */}
      <AppBar sx={{ backgroundColor: blue[700], backgroundImage: "none" }} position="sticky">
        <Toolbar>
          <Icon path={mdiStickerCheckOutline} size={1.25} />
          <Typography variant="h5" noWrap flexGrow={1} ml={2}>
            Task.json Web
          </Typography>

					<IconButton
						color="inherit"
						title={`Switch to ${dark.value ? "light" : "dark"} mode`}
						onClick={toggleTheme}
					>
						{dark.value ?
              <Icon path={mdiBrightness4} size={1.25} /> :
              <Icon path={mdiBrightness7} size={1.25} />}
					</IconButton>

					<IconButton
						color="inherit"
						title="Settings"
						onClick={() => settingsDialog.value = true}
					>
            <Icon path={mdiCog} size={1.25} />
					</IconButton>
        </Toolbar>
      </AppBar>

      <SettingsDialog open={settingsDialog} />

      <Box sx={{ my: 3 }}>
				{props.children}
      </Box>
    </>
  );
}

