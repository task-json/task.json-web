import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification, Settings } from "../types";
import { initTaskJson, Task, TaskJson, TaskType } from "task.json";
import axios from "axios";
import _ from "lodash";

// FIXME: use task.json-client
const getTasks = createAsyncThunk("getTasks", async () => {
	const resp = await axios.get("/tasks");
	const tasks: TaskJson = JSON.parse(resp.data);
	return tasks;
});

const initialState = {
	taskJson: initTaskJson(),
	notifications: [] as Notification[],
	loading: false,
	settings: {
		maxPriorities: 3
	} as Settings
};

const rootSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		addNotification(state, action: PayloadAction<Notification>) {
			state.notifications.push({
				...action.payload,
				id: new Date().toISOString()
			});
		},
		// remove the first notification
		removeNotification(state, action: PayloadAction<string>) {
			_.remove(state.notifications, e => e.id === action.payload);
		},
		addTask(state, action: PayloadAction<Task>) {
			state.taskJson.todo.push(action.payload);
		},
		removeTasks(state, action: PayloadAction<{
			type: "todo" | "done",
			indexes: number[]
		}>) {
			const date = new Date().toISOString();
			const { type, indexes } = action.payload;
			const removedTasks = _.remove(state.taskJson[type], (_, index) => indexes.includes(index))
				.map(task => {
					task.modified = date;
					return task;
				});
			state.taskJson.removed.push(...removedTasks);
		},
		doTasks(state, action: PayloadAction<number[]>) {
			const date = new Date().toISOString();
			const indexes = action.payload;
			const doneTasks = _.remove(state.taskJson.todo, (_, index) => indexes.includes(index))
				.map(task => {
					task.end = date;
					task.modified = date;
					return task;
				});
			state.taskJson.done.push(...doneTasks);
		},
		undoTasks(state, action: PayloadAction<{
			type: "removed" | "done",
			indexes: number[]
		}>) {
			const date = new Date().toISOString();
			const { type, indexes } = action.payload;
			const undoneTasks = _.remove(state.taskJson[type], (_, index) => indexes.includes(index))
				.map(task => {
					task.modified = date;
					return task;
				});
			const doneTasks = undoneTasks.filter(task => type === "removed" && task.end);
			const todoTasks = undoneTasks.filter(task => type === "done" || !task.end);
			todoTasks.forEach(task => {
				delete task.end;
				return task;
			});
			state.taskJson.todo.push(...todoTasks);
			state.taskJson.done.push(...doneTasks);
		},
		modifyTask(state, action: PayloadAction<{
			type: TaskType;
			task: Task;
		}>) {
			const { type, task } = action.payload;
			const index = state.taskJson[type].findIndex(t => t.uuid === task.uuid);
			state.taskJson[type][index] = task;
		},
		setTaskJson(state, action: PayloadAction<TaskJson>) {
			state.taskJson = action.payload;
		},
		updateSettings(state, action: PayloadAction<Settings>) {
			state.settings = action.payload;
		},
		updateMaxPriorities(state, action: PayloadAction<number>) {
			state.settings.maxPriorities = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addCase(getTasks.pending, state => {
			state.loading = true;
		});
		builder.addCase(getTasks.rejected, (state, action) => {
			state.loading = false;
			state.notifications.push({
				id: new Date().toISOString(),
				severity: "error",
				text: action.error.message!
			});
		});
		builder.addCase(getTasks.fulfilled, (state, action) => {
			state.loading = false;
			state.taskJson = action.payload;
		});
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
		taskJson: state.taskJson,
	});
}, 1000));

export default store;

export const rootActions = rootSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
