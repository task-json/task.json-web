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
  open: Signal<boolean>,
  text: Signal<string>,
  onConfirm: () => any;
}

function ConfirmationDialog(props: Props) {
  const close = () => {
    props.open.value = false;
  };

  const confirm = () => {
    close();
    props.onConfirm();
  };

	return (
		<Dialog
			open={props.open.value}
			onClose={close}
		>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.text.value}</DialogContentText>
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
