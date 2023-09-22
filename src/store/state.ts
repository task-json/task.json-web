import { computed, effect, signal } from "@preact/signals";
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
};


function loadState(key: string) {
  try {
    const data = localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    }
  }
  catch (err: any) {
    console.error(err);
  }
  return undefined;
}

// global app state
export const state = {
  taskJson: signal<Task[]>(loadState("taskJson") ?? []),
	settings: signal<Settings>(loadState("settings") ?? {
		maxPriorities: 3,
		dark: false
	}),
  notifications: signal<Notification[]>([]),
  confirmation: {
    open: signal(false),
    text: signal(""),
    onConfirm: () => {}
  },
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

// Persist state on change
effect(() => {
  localStorage.setItem("taskJson", JSON.stringify(state.taskJson.value));
  localStorage.setItem("settings", JSON.stringify(state.settings.value));
});

