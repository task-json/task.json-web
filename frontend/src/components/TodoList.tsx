import { Fragment } from "react";
import { green } from "@material-ui/core/colors"
import { Chip, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { TodoTxtItem } from "jstodotxt";
import { format } from "date-fns";
import MUIDataTable from "mui-datatables";
import { Plus as PlusIcon } from "mdi-material-ui";

interface Props {
	onAdd: () => void,
	data: TodoTxtItem[]
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
								{props.data[index].projects?.map(proj => (
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
								{props.data[index].contexts?.map(ctx => (
									<Chip className={classes.chip} label={ctx} key={ctx} />
								))}
							</Fragment>
						)
					}
				},
				{
					name: "date",
					label: "Date",
					options: {
						filterType: "textField",
						customBodyRender: (row: Date | null) => row && format(row, "yyyy-MM-dd")
					}
				}
			]}
			data={props.data}
			// actions={[
			// 	{
			// 		icon: () => <Add className={classes.add} />,
			// 		tooltip: "Add Task",
			// 		isFreeAction: true,
			// 		onClick: props.onAdd
			// 	}
			// ]}
		/>
	);
}

export default TodoList;
