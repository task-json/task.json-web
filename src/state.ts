import { signal } from "@preact/signals";
import { createContext } from "preact";
import { Task } from "task.json";
import { AlertColor } from "@mui/material/Alert";

export type Notification = {
	id?: string;
	color: AlertColor;
	text: string;
};

export const createNotification = (payload: Notification) => ({
	...payload,
	id: new Date().toISOString()
});


export type Settings = {
	maxPriorities: number;
	dark: boolean;
	server?: string;
	token?: string;
};

// global app state
export function createState() {
  const taskJson = signal<Task[]>([]);
  const notifications = signal<Notification[]>([]);
	const settings = signal<Settings>({
		maxPriorities: 3,
		dark: false
	});

  return { taskJson, notifications, settings };
}

export const StateContext = createContext<ReturnType<typeof createState>>(undefined);

