import { computed, signal } from "@preact/signals";
import { Task, TaskJson, TaskStatus } from "task.json";
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

function aggregateTasks(tasks: Task[], field: "projects" | "contexts") {
  const values: Set<string> = new Set();

  for (const task of tasks) {
    if (task.status === "removed") {
      continue;
    }
    task[field]?.forEach(value => {
      values.add(value);
    });
  }
  return [...values];
}

export const computedState = {
  allProjects: computed(() => aggregateTasks(state.taskJson.value, "projects")),
  allContexts: computed(() => aggregateTasks(state.taskJson.value, "contexts")),
  allPriorities:  computed(() => (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .substring(0, state.settings.value.maxPriorities)
      .split("")
  ))
};

