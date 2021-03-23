import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, Settings } from "../types";
import { initTaskJson, removeTasks, doTasks, undoTasks, Task, TaskJson, TaskType, idToIndex } from "task.json";
import { login, syncTasks, uploadTasks, downloadTasks } from "./async-actions";
import _ from "lodash";
import { HttpError } from 'task.json-client';

const initialState = {
	taskJson: initTaskJson(),
	notifications: [] as Notification[],
	loading: false,
	settings: {
		maxPriorities: 3,
		dark: false
	} as Settings
};

const createNotification = (payload: Notification) => ({
	...payload,
	id: new Date().toISOString()
});

const handleError = (state: RootState, action: any) => {
	state.loading = false;
	const error = action.error;
	let message: string;
	if (error instanceof HttpError) {
		message = `Error ${error.status}: ${error.message}`;
	}
	else {
		message = (error as Error).message;
	}
	state.notifications.push(createNotification({
		severity: "error",
		text: message
	}));
};

const rootSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		addNotification(state, action: PayloadAction<Notification>) {
			state.notifications.push(createNotification(action.payload));
		},
		// remove the first notification
		removeNotification(state, action: PayloadAction<string>) {
			_.remove(state.notifications, e => e.id === action.payload);
		},
		addTask(state, action: PayloadAction<Task>) {
			state.taskJson.todo.push(action.payload);
		},
		// Manipulate by ids
		removeTasks(state, action: PayloadAction<{
			type: "todo" | "done",
			ids: string[]
		}>) {
			const { type, ids } = action.payload;
			const indexes = idToIndex(state.taskJson, type, ids);
			removeTasks(state.taskJson, type, indexes);
		},
		doTasks(state, action: PayloadAction<string[]>) {
			const ids = action.payload;
			const indexes = idToIndex(state.taskJson, "todo", ids);
			doTasks(state.taskJson, indexes);
		},
		undoTasks(state, action: PayloadAction<{
			type: "removed" | "done",
			ids: string[]
		}>) {
			const { type, ids } = action.payload;
			const indexes = idToIndex(state.taskJson, type, ids);
			undoTasks(state.taskJson, type, indexes);
		},
		modifyTask(state, action: PayloadAction<{
			type: TaskType;
			task: Task;
		}>) {
			const { type, task } = action.payload;
			const index = state.taskJson[type].findIndex(t => t.id === task.id);
			state.taskJson[type][index] = task;
		},
		setTaskJson(state, action: PayloadAction<TaskJson>) {
			state.taskJson = action.payload;
		},
		updateSettings(state, action: PayloadAction<{
			maxPriorities?: number | null;
			server?: string | null;
			token?: string | null;
			dark?: boolean;
		}>) {
			for (const [key, value] of Object.entries(action.payload)) {
				const typedKey = key as keyof Settings;
				if (value === null) {
					delete state.settings[typedKey];
				}
				else {
					state.settings[typedKey] = value as never;
				}
			}
		}
	},
	extraReducers(builder) {
		// login
		builder.addCase(login.pending, state => { state.loading = true; });
		builder.addCase(login.fulfilled, (state, action) => {
			state.loading = false;
			state.settings.token = action.payload;
		});
		builder.addCase(login.rejected, handleError);

		// syncTasks
		builder.addCase(syncTasks.pending, state => { state.loading = true; });
		builder.addCase(syncTasks.fulfilled, (state, action) => {
			state.loading = false;
			state.taskJson = action.payload;
		});
		builder.addCase(syncTasks.rejected, handleError);

		// downloadTasks
		builder.addCase(downloadTasks.pending, state => { state.loading = true; });
		builder.addCase(downloadTasks.fulfilled, (state, action) => {
			state.loading = false;
			state.taskJson = action.payload;
		});
		builder.addCase(downloadTasks.rejected, handleError);

		// uploadTasks
		builder.addCase(uploadTasks.pending, state => { state.loading = true; });
		builder.addCase(uploadTasks.fulfilled, state => { state.loading = false; });
		builder.addCase(uploadTasks.rejected, handleError);
	}
});

const loadState = () => {
	const serializedState = localStorage.getItem("task.json");
	if (serializedState === null)
		return undefined;
	return {
		...initialState,
		...JSON.parse(serializedState)
	};
};

const saveState = (state: object) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem("task.json", serializedState);
	}
	catch (err) {
		console.error(err);
	}
}

// Load state
const persistedState = loadState();
const store = configureStore({
	reducer: rootSlice.reducer,
	preloadedState: persistedState
});

// Save state
store.subscribe(_.throttle(() => {
	const state = store.getState();
	saveState({
		settings: state.settings,
		taskJson: state.taskJson
	});
}, 1000));

export default store;

export const rootActions = rootSlice.actions;
export const asyncActions = {
	login,
	syncTasks,
	uploadTasks,
	downloadTasks
};
export type RootState = ReturnType<typeof store.getState>;
