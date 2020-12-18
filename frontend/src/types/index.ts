import { Color as Severity } from "@material-ui/lab/Alert";

export type Notification = {
	id?: string,
	severity: Severity,
	text: string
};

export type Settings = {
	maxPriorities: number
};

export type Task = [
	boolean, // Done
	string, // Priority
	string, // Text
	string[], // Projects
	string[], // Contexts
	string | null, // Start Date
	string | null // End Date
];
