import { Color as Severity } from "@material-ui/lab/Alert";

export type Notification = {
	id?: string;
	severity: Severity;
	text: string;
};

export type Settings = {
	maxPriorities: number;
	server?: string;
	token?: string;
};
