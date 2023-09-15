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

