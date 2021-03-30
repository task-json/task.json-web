import { green, red, blue, cyan, amber } from "@material-ui/core/colors"
import { Chip, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import {
	Plus as PlusIcon,
	Delete as DeleteIcon,
	Pencil as PencilIcon,
	Restore as RestoreIcon,
	Check as CheckIcon,
	Close as CloseIcon
} from "mdi-material-ui";
import { TaskType, Task, taskUrgency } from "task.json";
import { DateTime } from "luxon";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../store";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

interface Props {
	onAdd: () => void;
	onEdit: (task: Task) => void;
	taskType: TaskType;
}

const useStyles = makeStyles(theme => ({
	add: {
		"&:hover": {
			color: green[500]
		}
	},
	edit: {
		"&:hover": {
			color: blue[500]
		}
	},
	del: {
		"&:hover": {
			color: red[500]
		}
	},
	toolbarSelect: {
		marginRight: theme.spacing(2)
	},
	actionButton: {
		marginLeft: theme.spacing(0.2)
	},
	chip: {
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(0.5),
		marginBottom: theme.spacing(0.5)
	},
	cyan: {
		fontWeight: 500,
		color: theme.palette.type === "dark" ? cyan[500] : cyan[600] 
	},
	red: {
		fontWeight: 500,
		color: red[400]
	},
	amber: {
		fontWeight: 500,
		color: theme.palette.type === "dark" ? amber[500] : amber[800] 
	}
}));


interface CustomToolbarProps {
	onAdd: () => void
};

// The actions are appended to the original toolbar actions
const CustomToolbar = (props: CustomToolbarProps) => {
	const classes = useStyles();

	return (
		<Tooltip title="Add Task">
			<IconButton className={classes.add} onClick={props.onAdd}>
				<PlusIcon />
			</IconButton>
		</Tooltip>
	);
};


interface CustomToolbarSelectProps {
	taskType: TaskType;
	onRemove: () => void;
	onErase: () => void;
	onUndo: () => void;
	onDo: () => void;
};

const CustomToolbarSelect = (props: CustomToolbarSelectProps) => {
	const classes = useStyles();

	return (
		<div className={classes.toolbarSelect}>
			{props.taskType !== "todo" &&
				<Tooltip title="Undo Tasks">
					<IconButton
						className={classes.add}
						onClick={props.onUndo}
					>
						<RestoreIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType === "todo" &&
				<Tooltip title="Do Tasks">
					<IconButton
						className={classes.add}
						onClick={props.onDo}
					>
						<CheckIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType !== "removed" &&
				<Tooltip title="Remove Tasks">
					<IconButton
						className={classes.del}
						onClick={props.onRemove}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType === "removed" &&
				<Tooltip title="Erase Tasks">
					<IconButton
						className={classes.del}
						onClick={props.onErase}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			}
		</div>
	);
};

interface ActionsProps {
	taskType: TaskType;
	task: Task;
	onRemove: (ids: string[]) => void;
	onErase: (ids: string[]) => void;
	onUndo: (ids: string[]) => void;
	onDo: (ids: string[]) => void;
	onEdit: (task: Task) => void;
};

const Actions = (props: ActionsProps) => {
	const classes = useStyles();

	return (
		<>
			{props.taskType === "todo" &&
				<Tooltip title="Do">
					<IconButton
						className={`${classes.add} ${classes.actionButton}`}
						size="small"
						onClick={() => props.onDo([props.task.id])}
					>
						<CheckIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType !== "todo" &&
				<Tooltip title="Undo">
					<IconButton
						className={`${classes.add} ${classes.actionButton}`}
						size="small"
						onClick={() => props.onUndo([props.task.id])}
					>
						<RestoreIcon />
					</IconButton>
				</Tooltip>
			}
			<Tooltip title="Edit">
				<IconButton
					className={classes.edit}
					size="small"
					onClick={() => props.onEdit(props.task)}
				>
					<PencilIcon />
				</IconButton>
			</Tooltip>
			{props.taskType !== "removed" &&
				<Tooltip title="Remove">
					<IconButton
						className={`${classes.del} ${classes.actionButton}`}
						size="small"
						onClick={() => props.onRemove([props.task.id])}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType === "removed" &&
				<Tooltip title="Erase">
					<IconButton
						className={`${classes.del} ${classes.actionButton}`}
						size="small"
						onClick={() => props.onErase([props.task.id])}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			}
		</>
	);
};

function TaskList(props: Props) {
	const [confirmationText, setConfirmationText] = useState("");
	const [confirmationDialog, setConfirmationDialog] = useState(false);
	const [eraseIds, setEraseIds] = useState([] as string[]);
	const classes = useStyles();
	const dispatch = useDispatch();

	const originalTasks = useSelector(
		(state: RootState) => (
			state.taskJson[props.taskType].map(task => ({
				...task,
				due: task.due && DateTime.fromISO(task.due).toFormat("yyyy-MM-dd")
			}))
		)
	);

	// sorted tasks
	let tasks: Task[];
	// Map<id, urgency>
	const urgencyMap = new Map<string, number>();
	if (props.taskType === "todo") {
		for (const task of originalTasks) {
			urgencyMap.set(task.id, taskUrgency(task));
		}
		tasks = originalTasks.sort(
			(a, b) => urgencyMap.get(b.id)! - urgencyMap.get(a.id)!
		);
	}
	else {
		tasks = originalTasks;
	}

	const removeTasks = (ids: string[]) => {
		if (props.taskType !== "removed") {
			dispatch(rootActions.removeTasks({
				type: props.taskType,
				ids
			}));
		}
	};

	const handleEraseCancel = () => {
		setConfirmationDialog(false);
	};
	const handleErase = (ids: string[]) => {
		setEraseIds(ids);
		setConfirmationText("Warning: This will delete tasks permanently. Make sure the erased tasks are not in other servers and clients if you want to sync with them. Are you sure to erase?");
		setConfirmationDialog(true);
	};
	const eraseTasks = () => {
		setConfirmationDialog(false);
		dispatch(rootActions.eraseTasks(eraseIds));
	};

	const undoTasks = (ids: string[]) => {
		if (props.taskType !== "todo") {
			dispatch(rootActions.undoTasks({
				type: props.taskType,
				ids
			}));
		}
	};

	const doTasks = (ids: string[]) => {
		dispatch(rootActions.doTasks(ids));
	};

	const colorTask = (task: Task) => {
		// Only color todo tasks
		if (props.taskType !== "todo")
			return "";

		const urgency = urgencyMap.get(task.id)!;
		if (urgency >= 1000)
			return classes.red;
		if (urgency >= 100)
			return classes.amber;
		if (urgency >= 1)
			return classes.cyan;
		return "";
	};

	return (
		<>
			<ConfirmationDialog
				open={confirmationDialog}
				text={confirmationText}
				onCancel={handleEraseCancel}
				onConfirm={eraseTasks}
			/>
			<MUIDataTable
				title=""
				options={{
					print: false,
					download: false,
					customToolbar: () => {
						return <CustomToolbar onAdd={props.onAdd} />
					},
					customToolbarSelect: (selectedRows, _, setSelectedRows) => {
						const ids = selectedRows.data.map(({ dataIndex }) => tasks[dataIndex].id);
						return (
							<CustomToolbarSelect
								taskType={props.taskType}
								onRemove={() => {
									setSelectedRows([]);
									removeTasks(ids);
								}}
								onErase={() => {
									// When focus is lost, the selected rows will be cleared automatically
									// setSelectedRows([]);
									handleErase(ids);
								}}
								onUndo={() => {
									setSelectedRows([]);
									undoTasks(ids);
								}}
								onDo={() => {
									setSelectedRows([]);
									doTasks(ids);
								}}
							/>
						);
					}
				}}
				columns={[
					{
						name: "priority",
						label: "P",
						options: {
							sortThirdClickReset: true,
							sortCompare(order) {
								return (obj1, obj2) => {
									const a: string = obj1.data;
									const b: string = obj2.data;
									let result = 0;
									if (a === undefined)
										result = -1;
									if (b === undefined)
										result = 1;
									if (a < b)
										result = 1;
									else if (a > b)
										result = -1;

									return result * (order === "asc" ? 1 : -1);
								};
							},
							customBodyRenderLite: index => (
								<span className={colorTask(tasks[index])}>{tasks[index].priority}</span>
							)
						}
					},
					{
						name: "text",
						label: "Text",
						options: {
							filterType: "textField",
							sort: false,
							customBodyRenderLite: index => (
								<span className={colorTask(tasks[index])}>{tasks[index].text}</span>
							)
						}
					},
					{
						name: "projects",
						label: "Projects",
						options: {
							filterType: "multiselect",
							sort: false,
							customBodyRenderLite: index => (
								<>
									{tasks[index].projects?.map(proj => (
										<Chip className={classes.chip} label={proj} key={proj} />
									))}
								</>
							)
						}
					},
					{
						name: "contexts",
						label: "Contexts",
						options: {
							filterType: "multiselect",
							sort: false,
							customBodyRenderLite: index => (
								<>
									{tasks[index].contexts?.map(ctx => (
										<Chip className={classes.chip} label={ctx} key={ctx} />
									))}
								</>
							)
						}
					},
					{
						name: "due",
						label: "Due",
						options: {
							sortThirdClickReset: true,
							filterType: "textField",
							customBodyRenderLite: index => (
								<span className={colorTask(tasks[index])}>{tasks[index].due}</span>
							)
						}
					},
					{
						name: "actions",
						label: "Actions",
						options: {
							empty: true,
							sort: false,
							customBodyRenderLite: index => (
								<Actions
									taskType={props.taskType}
									task={tasks[index]}
									onEdit={props.onEdit}
									onRemove={removeTasks}
									onErase={handleErase}
									onUndo={undoTasks}
									onDo={doTasks}
								/>
							)
						}
					}
				]}
				data={tasks}
			/>
		</>
	);
}

export default TaskList;
