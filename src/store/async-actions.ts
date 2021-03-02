import { createAsyncThunk } from "@reduxjs/toolkit";
import { Client } from "task.json-client";
import { RootState } from "./index";

export const login = createAsyncThunk("login", async({
	server, password
}: {
	server: string;
	password: string;
}) => {
	const client = new Client(server);
	await client.login(password);
	return client.token!;
});

export const syncTasks = createAsyncThunk("syncTasks", async (_arg, thunkAPI) => {
	const state = thunkAPI.getState() as RootState;
	const client = new Client(state.settings.server!, state.settings.token);
	const taskJson = await client.sync(state.taskJson);
	return taskJson;
});

export const downloadTasks = createAsyncThunk("downloadTasks", async (_arg, thunkAPI) => {
	const state = thunkAPI.getState() as RootState;
	const client = new Client(state.settings.server!, state.settings.token);
	const taskJson = await client.download();
	return taskJson;
});

export const uploadTasks = createAsyncThunk("uploadTasks", async (_arg, thunkAPI) => {
	const state = thunkAPI.getState() as RootState;
	const client = new Client(state.settings.server!, state.settings.token);
	await client.upload(state.taskJson);
});
