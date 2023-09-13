import {
  Box,
	Button,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
	useMediaQuery,
  Theme
} from "@mui/material";
import FileSaver from "file-saver";
import { serializeTaskJson } from "task.json";
import ConfirmationDialog from "./ConfirmationDialog";
import { state } from "../store/state";
import { useComputed, useSignal, batch, Signal } from "@preact/signals";
import Icon from '@mdi/react';
import { mdiCloudDownload, mdiCloudUpload, mdiDelete, mdiImport, mdiExport, mdiSync } from "@mdi/js";

interface Props {
  open: Signal<boolean>
}

function SettingsDialog(props: Props) {
  const isSmallDevice = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const settings = useComputed(() => state.settings.value);

	// Local states
	const maxPriorities = useSignal(settings.value.maxPriorities.toString());
	const errorPriorities = useSignal(false);
	const server = useSignal(settings.value.server ?? "");
  const serverExists = useComputed(() => server.value.length > 0);
	const password = useSignal("");
	const token = useSignal(settings.value.token ?? "");
	const confirmDialog = useSignal(false);
  const confirmText = useSignal("");

  // reset local states
	const reset = () => {
    batch(() => {
      maxPriorities.value = settings.value.maxPriorities.toString();
      password.value  = "";
      server.value = settings.value.server ?? "";
      errorPriorities.value = false;
    })
  };

  const close = () => {
    props.open.value = false;
    reset();
  };

  const save = () => {
    if (!errorPriorities.value) {
      // TODO: update token
      state.settings.value = {
        ...settings.value,
        maxPriorities: parseInt(maxPriorities.value),
        server: serverExists.value ? server.value : undefined
      };

      props.open.value = false;
    }
  };

  const importData = (files: FileList | null) => {
    if (!files?.length)
      return;

    const reader = new FileReader();
		reader.onload = () => {
			const taskJson = JSON.parse(reader.result as string);
      state.taskJson.value = taskJson;
      state.notifications.value = [
        ...state.notifications.value,
        {
          id: new Date().toISOString(),
          color: "success",
          text: "Data imported successfully"
        }
			];
		};
		reader.readAsText(files[0]);
	};

	const exportData = () => {
		const blob = new Blob([
      serializeTaskJson(state.taskJson.value)
		], { type: "text/plain;charset=utf-8" });
		FileSaver.saveAs(blob, "task.json");
	};

	const clearData = () => {
    batch(() => {
      state.taskJson.value = [];
      state.notifications.value = [
        ...state.notifications.value,
        {
          id: new Date().toISOString(),
          color: "success",
          text: "Successfully cleared data"
        }
			];
    });
	};

	const clearAction = () => {
    batch(() => {
      confirmDialog.value = true;
      confirmText.value = "Warning: This will clear all the data in the local storage. Are you sure to clear?";
    });
	};

  // TODO: add actions
	const login = () => {
		// dispatch(asyncActions.login({
		// 	server,
		// 	password
		// }));
	}
	const logout = () => {
		// dispatch(rootActions.updateSettings({
		// 	token: null
		// }));
	};
	const sync = () => {
		// dispatch(asyncActions.syncTasks());
	}
	const upload = () => {
		// dispatch(asyncActions.uploadTasks());
	}
	const download = () => {
		// dispatch(asyncActions.downloadTasks());
	}

	return (
		<Dialog
			open={props.open.value}
			onClose={() => props.open.value = false}
			disableBackdropClick
			fullWidth
		>
			<DialogTitle sx={{ pb: 0 }}>Settings</DialogTitle>
			<DialogContent sx={{ px: isSmallDevice ? 1 : 0  }}>
				<ConfirmationDialog
          open={confirmDialog}
          text={confirmText}
					onConfirm={clearData}
				/>

				<List>
					<Box sx={{ mx:2, mt: 2 }}>
						<Typography color="textSecondary" sx={{ mb: 0.5 }}>
							General
						</Typography>
						<Divider />
					</Box>

					<ListItem>
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item>
								<ListItemText secondary={
									<span>
										between 1 and 26
										(start from <b>A</b>)
									</span>
								}>
									Max number of priorities
								</ListItemText>
							</Grid>
							<Grid item>
								<TextField
                  variant="standard"
									type="number"
                  sx={{ maxWidth: "45px" }}
									error={errorPriorities.value}
									value={maxPriorities.value}
									onChange={event => {
										const value = event.target.value;
										if (value.length === 0) {
                      errorPriorities.value = true;
                    }
										else {
											const i = parseInt(value);
                      errorPriorities.value = i <= 0 || i > 26;
										}
                    maxPriorities.value = value;
									}}
								/>
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item>
								<ListItemText secondary="task.json">
									JSON data
								</ListItemText>
							</Grid>
							<Grid item>
								<IconButton
									color="secondary"
                  sx={{ ml: 1 }}
									onClick={exportData}
									title="Export"
								>
                  <Icon path={mdiExport} size={1} />
								</IconButton>
								<input
									id="import-data-input"
									style={{ display: "none" }}
									type="file"
									onChange={event => importData(event.target.files)}
								/>
								<label htmlFor="import-data-input">
									<IconButton
										color="primary"
                    sx={{ ml: 1 }}
										component="span"
										title="Import"
									>
                    <Icon path={mdiImport} size={1} />
									</IconButton>
								</label>
								<IconButton
                  color="error"
                  sx={{ ml: 1 }}
									title="Clear"
									onClick={clearAction}
								>
                  <Icon path={mdiDelete} size={1} />
								</IconButton>
							</Grid>
						</Grid>
					</ListItem>

					<Box sx={{ mx:2, mt: 2 }}>
						<Typography color="textSecondary" sx={{ mb: 0.5 }}>
							Server
						</Typography>
						<Divider />
					</Box>

					<ListItem>
						<Grid container sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
							<Grid item>
								<ListItemText secondary="task.json-server">
									Server
								</ListItemText>
							</Grid>
							<Grid item>
								<TextField
                  variant="standard"
                  label="Server URL"
									value={server.value}
									onChange={event => server.value = event.target.value}
								/>
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
							<Grid item>
								<ListItemText secondary={settings.token ? "already logged in" : "not logged in"}>
									Session
								</ListItemText>
							</Grid>
							<Grid item style={{
								display: "flex",
								alignItems: "center"
							}}>
								{!settings.token && (
									<>
										<TextField
                      variant="standard"
											type="password"
                      sx={{ maxWidth: "200px", ml: 1 }}
											label="password"
											value={password.value}
											disabled={!serverExists.value}
											onChange={event => password.value = event.target.value}
										/>
										<Button
											size="small"
											disabled={!serverExists.value || password.value.length === 0}
											onClick={login}
											color="secondary"
										>
											Log in
										</Button>
									</>
								)}
								{Boolean(settings.token) &&
									<Button
										size="small"
                    color="error"
										onClick={logout}
									>
										Log out
									</Button>
								}
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item>
								<ListItemText>
									Sync
								</ListItemText>
							</Grid>
							<Grid item>
								<IconButton
									color="secondary"
                  sx={{ ml: 1 }}
									onClick={sync}
									disabled={!settings.token}
									title="Sync"
								>
                  <Icon path={mdiSync} size={1} />
								</IconButton>
								<IconButton
									color="primary"
                  sx={{ ml: 1 }}
									onClick={upload}
									disabled={!settings.token}
									title="Upload"
								>
                  <Icon path={mdiCloudUpload} size={1} />
								</IconButton>
								<IconButton
                  color="error"
                  sx={{ ml: 1 }}
									onClick={download}
									disabled={!settings.token}
									title="Download"
								>
                  <Icon path={mdiCloudDownload} size={1} />
								</IconButton>
							</Grid>
						</Grid>
					</ListItem>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={close}>Cancel</Button>
				<Button color="error" onClick={reset}>Reset</Button>
				<Button color="primary" onClick={save}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SettingsDialog;
