import MaterialTable, { Column } from "material-table";

interface Props {
	data: any,
	columns: Column<object>[]
}

function TodoList(props: Props) {
	return (
		<MaterialTable
			columns={[
				{ title: "Projects", field: "projects" },
				{ title: "Text", field: "text" },
				{ title: "Date", field: "date" },
				{ title: "" }
			]}
			data={props.data}
		/>
	);
}

export default TodoList;
