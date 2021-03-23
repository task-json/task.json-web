import { green, red, blue } from "@material-ui/core/colors"
import { Chip, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import {
	Plus as PlusIcon,
	Delete as DeleteIcon,
	Pencil as PencilIcon,
	Restore as RestoreIcon,
	Check as CheckIcon
} from "mdi-material-ui";
import { TaskType, Task, taskUrgency } from "task.json";
import { DateTime } from "luxon";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../store";

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
	selectedIds: string[];
	taskType: TaskType;
	onRemove: (ids: string[]) => void;
	onUndo: (ids: string[]) => void;
	onDo: (ids: string[]) => void;
};

const CustomToolbarSelect = (props: CustomToolbarSelectProps) => {
	const classes = useStyles();

	return (
		<div className={classes.toolbarSelect}>
			{props.taskType !== "todo" &&
				<Tooltip title="Undo Tasks">
					<IconButton
						className={classes.add}
						onClick={() => props.onUndo(props.selectedIds)}
					>
						<RestoreIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType === "todo" &&
				<Tooltip title="Do Tasks">
					<IconButton
						className={classes.add}
						onClick={() => props.onDo(props.selectedIds)}
					>
						<CheckIcon />
					</IconButton>
				</Tooltip>
			}
			{props.taskType !== "removed" &&
				<Tooltip title="Remove Tasks">
					<IconButton
						className={classes.del}
						onClick={() => props.onRemove(props.selectedIds)}
					>
						<DeleteIcon />
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
		</>
	);
};

function TaskList(props: Props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	// sorted tasks
	const tasks = useSelector(
		(state: RootState) => (
			state.taskJson[props.taskType].sort(
				(a, b) => taskUrgency(a) - taskUrgency(b)
			)
		)
	);

	const removeTasks = (ids: string[]) => {
		if (props.taskType !== "removed") {
			dispatch(rootActions.removeTasks({
				type: props.taskType,
				ids
			}));
		}
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

	return (
		<MUIDataTable
			title=""
			options={{
				print: false,
				download: false,
				customToolbar: () => {
					return <CustomToolbar onAdd={props.onAdd} />
				},
				customToolbarSelect: (selectedRows) => {
					const ids = selectedRows.data.map(({ dataIndex }) => tasks[dataIndex].id);
					return (
						<CustomToolbarSelect
							taskType={props.taskType}
							selectedIds={ids}
							onRemove={removeTasks}
							onUndo={undoTasks}
							onDo={doTasks}
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
						}
					}
				},
				{
					name: "text",
					label: "Text",
					options: {
						filterType: "textField",
						sort: false
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
						customBodyRender: (row: string | null) => row && DateTime.fromISO(row).toFormat("yyyy-MM-dd")
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
								onUndo={undoTasks}
								onDo={doTasks}
							/>
						)
					}
				}
			]}
			data={tasks}
		/>
	);
}

export default TaskList;
