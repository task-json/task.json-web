import {
	Dialog,
	DialogTitle
} from "@material-ui/core";

interface Props {
	open: boolean,
	onClose: () => void
}

function SettingsDialog(props: Props) {
	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="xs">
			<DialogTitle>Settings</DialogTitle>
		</Dialog>
	);
}

export default SettingsDialog;
