import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";

interface Props {
	open: boolean,
	onClose: () => void
}

const useStyles = makeStyles(theme => ({
	input: {
		marginBottom: theme.spacing(2)
	}
}));

function TaskDialog(props: Props) {
	const classes = useStyles();
	const [text, setText] = useState("");
	const [priority, setPriority] = useState("");

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="xs">
			<DialogTitle>Add Task</DialogTitle>
			<DialogContent>
				<TextField
					label="Text"
					className={classes.input}
					value={text}
					onChange={event => setText(event.target.value)}
					autoFocus
					fullWidth
				/>
				<TextField
					label="Priority"
					className={classes.input}
					fullWidth
				/>
				<TextField
					label="Projects"
					className={classes.input}
					fullWidth
				/>
				<TextField
					label="Contexts"
					className={classes.input}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>
					Cancel
				</Button>
				<Button>
					Reset
				</Button>
				<Button color="primary">
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default TaskDialog;
