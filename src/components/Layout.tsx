// Copyright (C) 2023  DCsunset

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { state } from "../store/state";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { blue } from "@mui/material/colors";
import Icon from '@mdi/react';
import { mdiStickerCheckOutline, mdiBrightness4, mdiBrightness7, mdiCog } from '@mdi/js';
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import SettingsDialog from "./SettingsDialog";


interface Props {
	children?: any;
};

export default function Layout(props: Props) {
  const dark = useComputed(() => state.settings.value.dark);
  const settingsDialog = useSignal(false);

  const toggleTheme = () => {
    state.settings.value = {
      ...state.settings.value,
      dark: !dark.value
    };
  };

  useSignalEffect(() => {
    const notification = state.notification.value;
    if (notification) {
      const { text, color } = notification;
      enqueueSnackbar(text, { variant: color });
    }
  });

  return (
    <>
      {/* Disable backgroundImage to avoid color change in dark theme */}
      <AppBar sx={{ backgroundColor: blue[700], backgroundImage: "none" }} position="sticky">
        <Toolbar>
          <Icon path={mdiStickerCheckOutline} size={1.25} />
          <Typography variant="h6" noWrap flexGrow={1} ml={1.5}>
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

      <SnackbarProvider anchorOrigin={{ horizontal: "center", vertical: "bottom" }} />

      <Box sx={{ my: 3 }}>
				{props.children}
      </Box>
    </>
  );
}

