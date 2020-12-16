import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification, Settings, Task } from "../types";
import axios from "axios";
import _ from "lodash";

const getTasks = createAsyncThunk("getTasks", async () => {
	const response = await axios.get("/tasks");
	const tasks: Task[] = JSON.parse(response.data);
	return tasks;
});

const initialState = {
	tasks: [] as Task[],
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
			state.tasks.push(action.payload);
		},
		removeTask(state, action: PayloadAction<number>) {
			state.tasks.splice(action.payload, 1);
		},
		updateTask(state, action: PayloadAction<{
			index: number,
			task: Task
		}>) {
			const { index, task } = action.payload;
			state.tasks[index] = task;
		},
		updateSettings(state, action: PayloadAction<Settings>) {
			state.settings = { ...action.payload };
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
			state.tasks = action.payload;
		});
	}
});

const loadState = () => {
	const serializedState = localStorage.getItem("todo.json");
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
		localStorage.setItem("todo.json", serializedState);
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
		tasks: state.tasks,
	});
}, 1000));

export default store;

export const rootActions = rootSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
