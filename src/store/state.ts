import { computed, effect, signal } from "@preact/signals";
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
  pageSize: number;
	maxPriorities: number;
	dark: boolean;
	server?: string;
};

function merge(value: any, init: any) {
  if (value?.constructor === Object) {
    // normal JSON-like object
    return {
      ...init,
      ...value
    };
  }
  else {
    return value || init;
  }
}

function loadState(key: string, init: any) {
  try {
    return merge(
      JSON.parse(localStorage.getItem(key)),
      init
    );
  }
  catch (err: any) {
    console.error(err);
    return init;
  }
}

// global app state
export const state = {
  taskJson: signal<Task[]>(loadState("taskJson", [])),
	settings: signal<Settings>(loadState("settings", {
    pageSize: 10,
		maxPriorities: 3,
		dark: false
	})),
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

