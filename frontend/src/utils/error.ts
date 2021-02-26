import { rootActions } from "../store";
import { HttpError } from "task.json-client";

export const errorGuard = (callback: any, dispatch: any) => {
	return async () => {
		try {
			await callback();
		}
		catch (error) {
			let message;
			if (error instanceof HttpError) {
				message = `Error ${error.status}: ${error.message}`;
			}
			else {
				message = (error as Error).message;
			}
			dispatch(rootActions.addNotification({
				severity: "error",
				text: message
			}));
		}
	};
};
