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

const useStyles = makeStyles(() => ({
	action: {
		maxWidth: "45px"
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

	const exportData = () => {
		const blob = new Blob([JSON.stringify(rootState.tasks, null, 2)], {
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
								<ListItemText secondary="JSON format">
									Export data
								</ListItemText>
							</Grid>
							<Grid item>
								<Button
									variant="contained"
									color="secondary"
									onClick={exportData}
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
