import { signal } from "@preact/signals";
import { Task } from "task.json";

export type Notification = {
	id?: string;
	severity: Severity;
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

