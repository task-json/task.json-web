import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from "../types";
import axios from "axios";
import _ from "lodash";

const getTasks = createAsyncThunk("getTasks", async () => {
	const response = await axios.get("/tasks");
	return response.data as string[];
});

const rootSlice = createSlice({
	name: "app",
	initialState: {
		tasks: [] as string[],
		notifications: [] as Notification[],
		loading: false
	},
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
		addTask(state, action: PayloadAction<string>) {
			state.tasks.push(action.payload);
		},
		removeTask(state, action: PayloadAction<number>) {
			state.tasks.splice(action.payload, 1);
		},
		updateTask(state, action: PayloadAction<{
			index: number,
			task: string
		}>) {
			const { index, task } = action.payload;
			state.tasks[index] = task;
		},
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

const store = configureStore({
	reducer: rootSlice.reducer
});

export default store;

export const rootActions = rootSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
