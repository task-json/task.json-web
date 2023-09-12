import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { Signal } from "@preact/signals";

interface Props {
  state: Signal<{ open: boolean, text: string}>;
}

function ConfirmationDialog({ state }: Props) {
	return (
		<Dialog
			open={state.value.open}
			onClose={() => state.value = { ...state.value, open: false }}
		>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onCancel}>
					Cancel
				</Button>
				<Button color="error" onClick={props.onConfirm}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationDialog;
