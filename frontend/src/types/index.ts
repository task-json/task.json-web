import { Color as Severity } from "@material-ui/lab/Alert";

export type Notification = {
	id?: string,
	severity: Severity,
	text: string
};
