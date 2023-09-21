import { state } from "../store/state";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

function ConfirmationDialog() {
  const close = () => {
    state.confirmation.open.value = false;
  };

  const confirm = () => {
    close();
    state.confirmation.onConfirm();
  };

	return (
		<Dialog
			open={state.confirmation.open.value}
			onClose={close}
		>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{state.confirmation.text.value}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={close}>
					Cancel
				</Button>
				<Button color="error" onClick={confirm}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationDialog;
