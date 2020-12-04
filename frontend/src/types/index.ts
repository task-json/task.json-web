import { Color as Severity } from "@material-ui/lab/Alert";

export type Notification = {
	id?: string,
	severity: Severity,
	text: string
};

export type TodoItem = {
	text: string,
	priority: string,
	complete: boolean,
	completed: Date,
	date: Date,
	contexts: string[],
	projects: string[]
};
