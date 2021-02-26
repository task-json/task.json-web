import {
	Button,
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
import { RootState, rootActions } from "../store";
import { initTaskJson } from "task.json";
import { redBgStyle, redStyle } from "../utils/styles";
import { errorGuard } from "../utils/error";
import { Client } from "task.json-client";

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
		marginTop: theme.spacing(1)
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
	const [token, setToken] = useState(settings.token ?? "");

	const reset = () => {
		setMaxPriorities(rootState.settings.maxPriorities.toString());
	};

	const save = () => {
		if (!errorPriorities) {
			dispatch(rootActions.updateSettings({
				maxPriorities: parseInt(maxPriorities),
				...(server.length && { server }),
				...(token.length && { token })
			}))
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
	};

	const login = errorGuard(async () => {
		const client = new Client(server);
		await client.login(password);
		setToken(client.token!);
	}, dispatch);

	const logout = () => {
		setToken("");
	};

	const sync = errorGuard(async () => {
		const client = new Client(server, token);
		const taskJson = await client.sync(rootState.taskJson);
		dispatch(rootActions.setTaskJson(taskJson));
	}, dispatch);

	const upload = errorGuard(async () => {
		const client = new Client(server, token);
		await client.upload(rootState.taskJson);
	}, dispatch);

	const download = errorGuard(async () => {
		const client = new Client(server, token);
		const taskJson = await client.download();
		dispatch(rootActions.setTaskJson(taskJson));
	}, dispatch);

	return (
		<Dialog open={props.open} onClose={props.onClose} fullWidth>
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
								<Button
									variant="contained"
									color="secondary"
									onClick={exportData}
									className={classes.dataButton}
									size="small"
								>
									Export
								</Button>
								<input
									id="import-data-input"
									style={{ display: "none" }}
									type="file"
									onChange={event => importData(event.target.files)}
								/>
								<label htmlFor="import-data-input">
									<Button
										variant="contained"
										color="primary"
										className={classes.dataButton}
										component="span"
										size="small"
									>
										Import
									</Button>
								</label>
								<Button
									size="small"
									variant="contained"
									color="primary"
									onClick={clearData}
									className={`${classes.dataButton} ${classes.redBg}`}
								>
									Clear
								</Button>
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
								<ListItemText secondary={token.length ? "already logged in" : "not logged in"}>
									Session
								</ListItemText>
							</Grid>
							<Grid item alignItems="center" style={{
								display: "flex"
							}}>
								{!token.length && (
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
											disabled={server.length === 0}
											onClick={login}
											color="secondary"
										>
											Log in
										</Button>
									</>
								)}
								{token.length > 0 &&
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
								<Button
									size="small"
									variant="contained"
									color="secondary"
									className={classes.dataButton}
									onClick={sync}
									disabled={token.length === 0}
								>
									Sync
								</Button>
								<Button
									size="small"
									variant="contained"
									color="primary"
									className={classes.dataButton}
									onClick={upload}
									disabled={token.length === 0}
								>
									Upload
								</Button>
								<Button
									size="small"
									variant="contained"
									color="primary"
									className={`${classes.dataButton} ${classes.redBg}`}
									onClick={download}
									disabled={token.length === 0}
								>
									Download
								</Button>
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
