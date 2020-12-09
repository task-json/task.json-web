import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";
import {
	KeyboardDatePicker
} from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getContexts, getProjects } from "../utils/tasks";

interface Props {
	open: boolean,
	onClose: () => void
}

const useStyles = makeStyles(theme => ({
	input: {
		marginBottom: theme.spacing(2),
		width: "100%"
	}
}));

function TaskDialog(props: Props) {
	const classes = useStyles();
	const [text, setText] = useState("");
	const [priority, setPriority] = useState("");
	const [projects, setProjects] = useState([] as string[]);
	const [contexts, setContexts] = useState([] as string[]);
	const [date, setDate] = useState<Date | null>(null);
	
	// Error states
	const [textError, setTextError] = useState(false);

	const tasks = useSelector((state: RootState) => state.tasks);
	const allProjects = getProjects(tasks);
	const allContexts = getContexts(tasks);

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const reset = () => {
		setText("");
		setPriority("");
		setDate(null);
		setProjects([]);
		setContexts([]);

		setTextError(false);
	};

	const handleClose = () => {
		props.onClose();
		reset();
	};

	const submit = () => {
		const error = text.length === 0;
		if (error) {
			setTextError(error);
		}
	}

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="xs">
			<DialogTitle>Add Task</DialogTitle>
			<DialogContent>
				<TextField
					error={textError}
					label="Text"
					required
					className={classes.input}
					value={text}
					onChange={event => setText(event.target.value)}
					onFocus={() => setTextError(false)}
					autoFocus
				/>
				<FormControl className={classes.input}>
					<InputLabel id="priority-select">Priority</InputLabel>
					<Select
						labelId="priority-select"
						value={priority}
						onChange={event => setPriority(event.target.value as string)}
					>
						<MenuItem value={""}>
							None
						</MenuItem>
						{alphabet.map(char => (
							<MenuItem value={char}>
								{char}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<KeyboardDatePicker
					className={classes.input}
					label="Date"
					format="yyyy-MM-dd"
					value={date}
					onChange={value => setDate(value)}
				/>
				<Autocomplete
					multiple
					freeSolo
					className={classes.input}
					value={projects}
					onChange={(_, value) => setProjects(value)}
					options={[...allProjects]}
					renderInput={params => (
						<TextField {...params} label="Projects" helperText="Press Enter to create new projects" />
					)}
				/>
				<Autocomplete
					multiple
					freeSolo
					className={classes.input}
					value={contexts}
					onChange={(_, value) => setContexts(value)}
					options={[...allContexts]}
					renderInput={params => (
						<TextField {...params} label="Contexts" helperText="Press Enter to create new contexts" />
					)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>
					Cancel
				</Button>
				<Button onClick={reset}>
					Reset
				</Button>
				<Button color="primary" onClick={submit}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default TaskDialog;
