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
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../store";
import { Task } from "task.json";
import { getFieldValues } from "../utils/task";
import { v4 as uuidv4 } from "uuid";

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
	const dispatch = useDispatch();
	const maxPriorities = useSelector((state: RootState) => state.settings.maxPriorities);
	const taskJson = useSelector((state: RootState) => state.taskJson);

	const initTask = () => ({
		text: "",
		priority: undefined,
		projects: [],
		contexts: [],
		due: null as null | string
	});
	
	// Task Field
	const [task, setTask] = useState(initTask());
	
	// Error states
	const [textError, setTextError] = useState(false);
	const [dueValid, setDueValid] = useState(false);

	const allProjects = getFieldValues(taskJson, "projects");
	const allContexts = getFieldValues(taskJson, "contexts");

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		.substr(0, maxPriorities)
		.split("");

	const reset = () => {
		setTask(initTask());
		setTextError(false);
	};

	const setTaskField = (field: keyof Task, value: any) => {
		if (field) {
			// FIXME
			console.log(field, value)
			setTask({
				...task,
				[field]: value
			});
		}
	};

	const handleClose = () => {
		props.onClose();
		reset();
	};

	const submit = () => {
		console.log(task);
		const error = task.text.length === 0;
		if (error) {
			setTextError(error);
			return;
		}
		if (!dueValid)
			return;

		const date = new Date().toISOString();
		dispatch(rootActions.addTask({
			uuid: uuidv4(),
			text: task.text,
			priority: task.priority,
			projects: task.projects.length ? task.projects : undefined,
			contexts: task.contexts.length ? task.contexts : undefined,
			due: task.due ? new Date(task.due).toISOString() : undefined,
			start: date,
			modified: date
		}));
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
						<MenuItem value={undefined}>
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
					label="Due Date"
					format="yyyy-MM-dd"
					value={task.due || null}
					clearable
					onChange={(date, value) => {
						setTaskField("due", value);
						setDueValid(date === null || date.isValid);
					}}
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
