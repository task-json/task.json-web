import { Color as Severity } from "@material-ui/lab/Alert";

export type Notification = {
	id?: string,
	severity: Severity,
	text: string
};

export type Settings = {
	maxPriorities: number
};

export type Task = {
	text: string;
	priority: string;
	done: boolean;
	contexts: string[];
	projects: string[];
	due: string | null;
	start: string | null;
	end: string | null;
};
