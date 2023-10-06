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

import { createNotification, state } from "./state";
import { HttpError, setupClient } from "task.json-client";

function handleError(error: any) {
  let message: string;
	if (error instanceof HttpError) {
		message = `Error ${error.status}: ${error.message}`;
	}
	else {
		message = (error as Error).message;
	}
	state.notifications.value = [
    ...state.notifications.value,
    createNotification({
      color: "error",
      text: message
    })
  ];
}

export async function login(server: string, password: string) {
  try {
    state.client = await setupClient({ server });
    await state.client.login(password);
  }
  catch (err: any) {
    handleError(err);
  }
}

export async function logout() {
  try {
    await state.client.logout();
  }
  catch (err: any) {
    handleError(err);
  }
}

export async function syncTasks() {
  try {
    const { data } = await state.client.sync(state.taskJson.value);
    state.taskJson.value = data;
  }
  catch (err: any) {
    handleError(err);
  }
}

export async function downloadTasks() {
  try {
    const { data } = await state.client.download();
    state.taskJson.value = data;
  }
  catch (err: any) {
    handleError(err);
  }
}

export async function uploadTasks() {
  try {
    await state.client.upload(state.taskJson.value);
  }
  catch (err: any) {
    handleError(err);
  }
}

