import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	List,
	ListItem,
	ListItemText,
	makeStyles,
	TextField
} from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileSaver from "file-saver";
import { RootState, rootActions } from "../store";

interface Props {
	open: boolean,
	onClose: () => void
}

const useStyles = makeStyles(theme => ({
	action: {
		maxWidth: "45px"
	},
	dataButton: {
		marginLeft: theme.spacing(1.5)
	}
}));

function SettingsDialog(props: Props) {
	const classes = useStyles();
	const rootState = useSelector((state: RootState) => state);
	const dispatch = useDispatch();

	// Local states
	const [maxPriorities, setMaxPriorities] = useState(rootState.settings.maxPriorities.toString());
	const [errorPriorities, setErrorPriorities] = useState(false);

	const reset = () => {
		setMaxPriorities(rootState.settings.maxPriorities.toString());
	};

	const save = () => {
		if (!errorPriorities) {
			dispatch(rootActions.updateMaxPriorities(parseInt(maxPriorities)));
			props.onClose();
		}
	};

	const importData = (files: FileList | null) => {
		if (!files?.length)
			return;
		
		const reader = new FileReader();
		reader.onload = () => {
			const tasks = JSON.parse(reader.result as string);
			dispatch(rootActions.setTasks(tasks));
			dispatch(rootActions.addNotification({
				severity: "success",
				text: "Data imported successfully"
			}));
		};
		reader.readAsText(files[0]);
	};

	const exportData = () => {
		const data = "[\n\t"
			+ rootState.tasks
				.map(task => (
					"[" + task.map(field => JSON.stringify(field))
						.join(", ") + "]"
				))
				.join(",\n\t")
			+ "\n]";

		const blob = new Blob([data], {
			type: "text/plain;charset=utf-8"
		});
		FileSaver.saveAs(blob, "todo.json");
	};

	return (
		<Dialog open={props.open} onClose={props.onClose} fullWidth>
			<DialogTitle>Settings</DialogTitle>
			<DialogContent>
				<List>
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
									className={classes.action}
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
								<ListItemText secondary="todo.json">
									JSON data
								</ListItemText>
							</Grid>
							<Grid item>
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
									>
										Import
									</Button>
								</label>
								<Button
									variant="contained"
									color="secondary"
									onClick={exportData}
									className={classes.dataButton}
								>
									Export
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
				<Button onClick={reset}>Reset</Button>
				<Button color="primary" onClick={save}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SettingsDialog;
