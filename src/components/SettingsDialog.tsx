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
	Typography
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileSaver from "file-saver";
import { RootState, rootActions, asyncActions } from "../store";
import { initTaskJson } from "task.json";
import { redBgStyle, redStyle } from "../utils/styles";
import {
	CloudUpload as CloudUploadIcon,
	CloudDownload as CloudDownloadIcon,
	Sync as SyncIcon,
	Import as ImportIcon,
	Export as ExportIcon,
	Delete as DeleteIcon
} from "mdi-material-ui";

interface Props {
	open: boolean,
	onClose: () => void
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
	red: redStyle(theme),
	redBg: redBgStyle(theme)
}));

function SettingsDialog(props: Props) {
	const classes = useStyles();
	const rootState = useSelector((state: RootState) => state);
	const settings = rootState.settings;
	const dispatch = useDispatch();

	// Local states
	const [maxPriorities, setMaxPriorities] = useState(rootState.settings.maxPriorities.toString());
	const [errorPriorities, setErrorPriorities] = useState(false);
	const [server, setServer] = useState(settings.server ?? "");
	const [password, setPassword] = useState("");
	const [oldToken, setOldToken] = useState(settings.token ?? "");

	const reset = () => {
		setMaxPriorities(rootState.settings.maxPriorities.toString());
		dispatch(rootActions.updateSettings({ token: oldToken }));
		setPassword("");
		setServer(settings.server ?? "");
		setErrorPriorities(false);
	};

	const save = () => {
		if (!errorPriorities) {
			dispatch(rootActions.updateSettings({
				maxPriorities: parseInt(maxPriorities),
				server: server.length ? server : null
			}));
			setOldToken(settings.token ?? "");
			props.onClose();
		}
	};

	const importData = (files: FileList | null) => {
		if (!files?.length)
			return;
		
		const reader = new FileReader();
		reader.onload = () => {
			const taskJson = JSON.parse(reader.result as string);
			dispatch(rootActions.setTaskJson(taskJson));
			dispatch(rootActions.addNotification({
				severity: "success",
				text: "Data imported successfully"
			}));
		};
		reader.readAsText(files[0]);
	};

	const exportData = () => {
		const blob = new Blob([
			JSON.stringify(rootState.taskJson, null, 2)
		], { type: "text/plain;charset=utf-8" });
		FileSaver.saveAs(blob, "task.json");
	};
	
	const clearData = () => {
		dispatch(rootActions.setTaskJson(initTaskJson()));
		dispatch(rootActions.addNotification({
			severity: "success",
			text: "Successfully cleared data"
		}))
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
			open={props.open}
			onClose={props.onClose}
			disableBackdropClick
			fullWidth
		>
			<DialogTitle className={classes.title}>Settings</DialogTitle>
			<DialogContent>
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
									onClick={clearData}
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
