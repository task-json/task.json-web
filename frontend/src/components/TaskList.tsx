import { Fragment } from "react";
import { green, red, blue } from "@material-ui/core/colors"
import { Chip, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import {
	Plus as PlusIcon,
	Delete as DeleteIcon,
	Pencil as PencilIcon
} from "mdi-material-ui";
import { TaskType, Task } from "task.json";
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
	selectedRows: number[],
	onRemove: (indexes: number[]) => void;
};

const CustomToolbarSelect = (props: CustomToolbarSelectProps) => {
	const classes = useStyles();

	return (
		<Tooltip title="Remove Tasks">
			<IconButton
				className={`${classes.del} ${classes.toolbarSelect}`}
				onClick={() => props.onRemove(props.selectedRows)}
			>
				<DeleteIcon />
			</IconButton>
		</Tooltip>
	);
};

function TaskList(props: Props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const tasks = useSelector((state: RootState) => state.taskJson[props.taskType]);

	const removeTasks = (indexes: number[]) => {
		dispatch(rootActions.removeTasks({
			type: props.taskType as any,
			indexes
		}));
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
					const indexes = selectedRows.data.map(({ dataIndex }) => dataIndex);
					return <CustomToolbarSelect selectedRows={indexes} onRemove={removeTasks} />
				}
			}}
			columns={[
				{
					name: "priority",
					label: "P",
					options: {
						sortCompare(order) {
							return (obj1, obj2) => {
								const a: string = obj1.data;
								const b: string = obj2.data;
								let result = 0;
								if (a === null)
									result = -1;
								if (b === null)
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
						filterType: "textField"
					}
				},
				{
					name: "projects",
					label: "Projects",
					options: {
						filterType: "multiselect",
						customBodyRenderLite: index => (
							<Fragment>
								{tasks[index].projects?.map(proj => (
									<Chip className={classes.chip} label={proj} key={proj} />
								))}
							</Fragment>
						)
					}
				},
				{
					name: "contexts",
					label: "Contexts",
					options: {
						filterType: "multiselect",
						customBodyRenderLite: index => (
							<Fragment>
								{tasks[index].contexts?.map(ctx => (
									<Chip className={classes.chip} label={ctx} key={ctx} />
								))}
							</Fragment>
						)
					}
				},
				{
					name: "due",
					label: "Due",
					options: {
						filterType: "textField",
						customBodyRender: (row: string | null) => row && DateTime.fromISO(row).toFormat("yyyy-MM-dd")
					}
				},
				{
					name: "actions",
					label: "Actions",
					options: {
						empty: true,
						customBodyRenderLite: index => (
							<Fragment>
								<Tooltip title="Edit">
									<IconButton
										className={classes.edit}
										size="small"
										onClick={() => props.onEdit(tasks[index])}
									>
										<PencilIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Remove">
									<IconButton
										className={`${classes.del} ${classes.actionButton}`}
										size="small"
										onClick={() => removeTasks([index])}
									>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</Fragment>
						)
					}
				}
			]}
			data={tasks}
		/>
	);
}

export default TaskList;
