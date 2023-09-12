import {
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
	makeStyles,
	TextField,
	Typography,
	useMediaQuery
} from "@mui/material";
import FileSaver from "file-saver";
import { RootState, rootActions, asyncActions } from "../store";
import { serializeTaskJson } from "task.json";
import { redBgStyle, redStyle } from "../utils/styles";
import {
	CloudUpload as CloudUploadIcon,
	CloudDownload as CloudDownloadIcon,
	Sync as SyncIcon,
	Import as ImportIcon,
	Export as ExportIcon,
	Delete as DeleteIcon
} from "mdi-material-ui";
import ConfirmationDialog from "./ConfirmationDialog";
import { useContext } from "preact/hooks";
import { StateContext } from "../state";
import { useComputed, useSignal, batch, Signal } from "@preact/signals";

interface Props {
  open: Signal<boolean>
}

const useStyles = makeStyles(theme => ({
	number: {
		maxWidth: "45px"
	},
	password: {
		maxWidth: "200px",
		marginRight: theme.spacing(1)
	},
	dataButton: {
		marginLeft: theme.spacing(1)
	},
	title: {
		paddingBottom: 0
	},
	subtitle: {
		marginBottom: theme.spacing(0.5)
	},
	divider: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		marginTop: theme.spacing(2)
	},
	smallPadding: {
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},
	red: redStyle(theme),
	redBg: redBgStyle(theme)
}));

function SettingsDialog(props: Props) {
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("xs"));
  const state = useContext(StateContext);
  const settings = useComputed(() => state.settings.value);

	// Local states
	const maxPriorities = useSignal(settings.value.maxPriorities.toString());
	const errorPriorities = useSignal(false);
	const server = useSignal(settings.value.server ?? "");
	const password = useSignal("");
	const oldToken = useSignal(settings.value.token ?? "");
	const confirmationDialog = useSignal({
    open: false,
    text: ""
  });

  // reset local states
	const reset = () => {
    batch(() => {
      maxPriorities.value = settings.value.maxPriorities.toString();
      password.value  = "";
      server.value = settings.value.server ?? "";
      errorPriorities.value = false;
    })
	};

	const save = () => {
		if (!errorPriorities.value) {
      // TODO: update token
      state.settings.value = {
        ...settings.value,
				maxPriorities: parseInt(maxPriorities.value),
				server: server.value.length ? server.value : undefined
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
      confirmationDialog.value = {
        open: false,
        text: ""
      };
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
  
	const handleClearData = () => {
    confirmationDialog.value = {
      open: true,
      text: "Warning: This will clear all the data in the local storage. Are you sure to clear?"
    };
	};

	const login = () => {
		dispatch(asyncActions.login({
			server,
			password
		}));
	}
	const logout = () => {
		dispatch(rootActions.updateSettings({
			token: null
		}));
	};
	const sync = () => {
		dispatch(asyncActions.syncTasks());
	}
	const upload = () => {
		dispatch(asyncActions.uploadTasks());
	}
	const download = () => {
		dispatch(asyncActions.downloadTasks());
	}

	return (
		<Dialog
			open={props.open.value}
			onClose={() => props.open.value = false}
			disableBackdropClick
			fullWidth
		>
			<DialogTitle sx={{pb: 0}}>Settings</DialogTitle>
			<DialogContent className={isSmallDevice ? classes.smallPadding : ""}>
				<ConfirmationDialog
					open={confirmationDialog}
					text={confirmationText}
					onCancel={() => confirmationDialog.value = false}
					onConfirm={clearData}
				/>

				<List>
					<div className={classes.divider}>
						<Typography color="textSecondary" className={classes.subtitle}>
							General
						</Typography>
						<Divider />
					</div>

					<ListItem>
						<Grid container justify="space-between" alignItems="center">
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
									className={classes.number}
									error={errorPriorities}
									type="number"
									value={maxPriorities}
									onChange={event => {
										const value = event.target.value;
										if (value.length === 0)
											setErrorPriorities(true);
										else {
											const i = parseInt(value);
											setErrorPriorities(i <= 0 || i > 26);
										}
										setMaxPriorities(value);
									}}
								/>
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container justify="space-between" alignItems="center">
							<Grid item>
								<ListItemText secondary="task.json">
									JSON data
								</ListItemText>
							</Grid>
							<Grid item>
								<IconButton
									color="secondary"
									onClick={exportData}
									className={classes.dataButton}
									title="Export"
								>
									<ExportIcon />
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
										className={classes.dataButton}
										component="span"
										title="Import"
									>
										<ImportIcon />
									</IconButton>
								</label>
								<IconButton
									onClick={handleClearData}
									className={`${classes.dataButton} ${classes.red}`}
									title="Clear"
								>
									<DeleteIcon />
								</IconButton>
							</Grid>
						</Grid>
					</ListItem>

					<div className={classes.divider}>
						<Typography color="textSecondary" className={classes.subtitle}>
							Server
						</Typography>
						<Divider />
					</div>

					<ListItem>
						<Grid container justify="space-between" alignItems="center">
							<Grid item>
								<ListItemText secondary="task.json-server">
									Server
								</ListItemText>
							</Grid>
							<Grid item>
								<TextField
									value={server}
									onChange={event => setServer(event.target.value)}
								/>
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container justify="space-between" alignItems="center">
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
											type="password"
											label="password"
											value={password}
											disabled={server.length === 0}
											onChange={event => setPassword(event.target.value)}
											className={classes.password}
										/>
										<Button
											size="small"
											disabled={server.length === 0 || password.length === 0}
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
										className={classes.red}
										onClick={logout}
									>
										Log out
									</Button>
								}
							</Grid>
						</Grid>
					</ListItem>

					<ListItem>
						<Grid container justify="space-between" alignItems="center">
							<Grid item>
								<ListItemText>
									Sync
								</ListItemText>
							</Grid>
							<Grid item>
								<IconButton
									color="secondary"
									className={classes.dataButton}
									onClick={sync}
									disabled={!settings.token}
									title="Sync"
								>
									<SyncIcon />
								</IconButton>
								<IconButton
									color="primary"
									className={classes.dataButton}
									onClick={upload}
									disabled={!settings.token}
									title="Upload"
								>
									<CloudUploadIcon />
								</IconButton>
								<IconButton
									color="primary"
									className={`${classes.dataButton} ${classes.red}`}
									onClick={download}
									disabled={!settings.token}
									title="Download"
								>
									<CloudDownloadIcon />
								</IconButton>
							</Grid>
						</Grid>
					</ListItem>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => {
					props.onClose();
					reset();
				}}>Cancel</Button>
				<Button className={classes.red} onClick={reset}>Reset</Button>
				<Button color="primary" onClick={save}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SettingsDialog;
