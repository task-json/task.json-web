import { Fragment } from "react";
import { green } from "@material-ui/core/colors"
import { Chip, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import MUIDataTable from "mui-datatables";
import { Plus as PlusIcon } from "mdi-material-ui";
import { Task } from "../types";
import { CTX, PROJ } from "../utils/task";

interface Props {
	onAdd: () => void,
	data: Task[]
}

const useStyles = makeStyles(theme => ({
	add: {
		"&:hover": {
			color: green[500]
		}
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

function TodoList(props: Props) {
	const classes = useStyles();

	return (
		<MUIDataTable
			title=""
			options={{
				print: false,
				download: false,
				customToolbar: () => {
					return <CustomToolbar onAdd={props.onAdd} />
				}
			}}
			columns={[
				{
					name: "Done",
					options: {
						display: false
					}
				},
				{
					name: "Pri",
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
					name: "Text",
					options: {
						filterType: "textField"
					}
				},
				{
					name: "Projects",
					options: {
						filterType: "multiselect",
						customBodyRenderLite: index => (
							<Fragment>
								{props.data[index][PROJ].map(proj => (
									<Chip className={classes.chip} label={proj} key={proj} />
								))}
							</Fragment>
						)
					}
				},
				{
					name: "Contexts",
					options: {
						filterType: "multiselect",
						customBodyRenderLite: index => (
							<Fragment>
								{props.data[index][CTX].map(ctx => (
									<Chip className={classes.chip} label={ctx} key={ctx} />
								))}
							</Fragment>
						)
					}
				},
				{
					name: "Start",
					options: {
						filterType: "textField"
					}
				}
			]}
			data={props.data}
		/>
	);
}

export default TodoList;
