import { signal } from "@preact/signals";
import { Task } from "task.json";
import { AlertColor } from "@mui/material/Alert";
import { Client } from "task.json-client";

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
export const state = {
  taskJson: signal<Task[]>([]),
  notifications: signal<Notification[]>([]),
	settings: signal<Settings>({
		maxPriorities: 3,
		dark: false
	}),
  // Client to connect to server
  client: null as (Client | null),
};

