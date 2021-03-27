import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	makeStyles
} from "@material-ui/core";
import { redStyle } from "../utils/styles";

interface Props {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	text: string;
}

const useStyles = makeStyles(theme => ({
	red: redStyle(theme)
}));

function ConfirmationDialog(props: Props) {
	const classes = useStyles();

	return (
		<Dialog
			open={props.open}
			onClose={props.onCancel}
		>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onCancel}>
					Cancel
				</Button>
				<Button className={classes.red} onClick={props.onConfirm}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationDialog;
