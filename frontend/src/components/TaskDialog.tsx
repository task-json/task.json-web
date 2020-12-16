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
import { useDispatch } from "react-redux";
import { rootActions } from "../store";
import { Task } from "../types";
import { initTask, getContexts, getProjects } from "../utils/task";

interface Props {
	open: boolean,
	onClose: () => void,
	tasks: Task[]
}

const useStyles = makeStyles(theme => ({
	input: {
		marginBottom: theme.spacing(2),
		width: "100%"
	}
}));

function TaskDialog(props: Props) {
	const classes = useStyles();
	const [task, setTask] = useState(initTask());
	const dispatch = useDispatch();
	
	// Error states
	const [textError, setTextError] = useState(false);

	const tasks = props.tasks;
	const allProjects = getProjects(tasks);
	const allContexts = getContexts(tasks);

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const reset = () => {
		setTask(initTask());

		setTextError(false);
	};

	const setTaskField = (field: keyof Task, value: any) => {
		setTask({
			...task,
			[field]: value
		});
	};

	const handleClose = () => {
		props.onClose();
		reset();
	};

	const submit = () => {
		const error = task.text.length === 0;
		if (error) {
			setTextError(error);
			return;
		}
		dispatch(rootActions.addTask(task));
		dispatch(rootActions.addNotification({
			severity: "success",
			text: "Successfully add a new task"
		}));
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
					value={task.text}
					onChange={event => setTaskField("text", event.target.value)}
					onFocus={() => setTextError(false)}
					autoFocus
				/>
				<FormControl className={classes.input}>
					<InputLabel id="priority-select">Priority</InputLabel>
					<Select
						labelId="priority-select"
						value={task.priority}
						onChange={event => setTaskField("priority", event.target.value)}
					>
						<MenuItem value={""}>
							None
						</MenuItem>
						{alphabet.map(char => (
							<MenuItem value={char} key={char}>
								{char}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<KeyboardDatePicker
					className={classes.input}
					label="Start Date"
					format="yyyy-MM-dd"
					value={task.startDate}
					onChange={(_, value) => setTaskField("startDate", value)}
				/>
				<Autocomplete
					multiple
					freeSolo
					className={classes.input}
					value={task.projects}
					onChange={(_, value) => setTaskField("projects", value)}
					options={[...allProjects]}
					renderInput={params => (
						<TextField {...params} label="Projects" helperText="Press Enter to create new projects" />
					)}
				/>
				<Autocomplete
					multiple
					freeSolo
					className={classes.input}
					value={task.contexts}
					onChange={(_, value) => setTaskField("contexts", value)}
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
