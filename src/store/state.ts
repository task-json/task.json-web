// Copyright (C) 2023  DCsunset

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { computed, effect, signal } from "@preact/signals";
import { Task } from "task.json";
import { AlertColor } from "@mui/material/Alert";
import { Client } from "task.json-client";

export type Notification = {
	color: AlertColor;
	text: string;
};

export type Settings = {
  pageSize: number;
	maxPriorities: number;
	dark: boolean;
	server?: string;
  token?: string;
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
  notification: signal<Notification | null>(null),
  confirmation: {
    open: signal(false),
    text: signal(""),
    onConfirm: () => {}
  },
  // Client to connect to server
  client: null as (Client | null)
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
});
effect(() => {
  localStorage.setItem("settings", JSON.stringify(state.settings.value));
});

