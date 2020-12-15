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
	const settings = useSelector((state: RootState) => state.settings);
	const dispatch = useDispatch();

	// Local states
	const [maxPriorities, setMaxPriorities] = useState(settings.maxPriorities.toString());
	const [errorPriorities, setErrorPriorities] = useState(false);

	const reset = () => {
		setMaxPriorities(settings.maxPriorities.toString());
	};

	const save = () => {
		if (!errorPriorities) {
			dispatch(rootActions.updateMaxPriorities(parseInt(maxPriorities)));
			props.onClose();
		}
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
