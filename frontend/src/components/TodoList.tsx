import MaterialTable, { Column } from "material-table";
import { forwardRef } from "react";
import {
	AddBox,
	Check,
	Clear,
	DeleteOutline,
	ChevronRight,
	Edit,
	ChevronLeft,
	Search,
	ArrowDownward,
	Remove,
	ViewColumn,
	FirstPage,
	LastPage,
	SaveAlt,
	FilterList
} from "@material-ui/icons"

const tableIcons = {
	Add: forwardRef((props: any, ref: any) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props: any, ref: any) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props: any, ref: any) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
	Edit: forwardRef((props: any, ref: any) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props: any, ref: any) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props: any, ref: any) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props: any, ref: any) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props: any, ref: any) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props: any, ref: any) => <ChevronLeft {...props} ref={ref} />),
	ResetSearch: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props: any, ref: any) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props: any, ref: any) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props: any, ref: any) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props: any, ref: any) => <ViewColumn {...props} ref={ref} />)
};

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
			icons={tableIcons as any}
		/>
	);
}

export default TodoList;
