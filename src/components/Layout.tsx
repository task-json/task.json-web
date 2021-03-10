import {
	AppBar,
	duration,
	IconButton,
	makeStyles,
	Snackbar,
	Toolbar,
	Typography
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, rootActions } from "../store";
import { Notification } from "../types";
import {
	Cog as CogIcon,
	StickerAlertOutline as StickerCheckOutlineIcon,
	Brightness4 as Brightness4Icon,
	Brightness7 as Brightness7Icon
} from "mdi-material-ui";
import SettingsDialog from "./SettingsDialog";
import { blue } from '@material-ui/core/colors';

type Props = {
	children?: any
};

const useStyles = makeStyles(theme => ({
	icon: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	},
	appBar: {
		backgroundColor: blue[700]
	}
}));

function Layout(props: Props) {
	const classes = useStyles();
	const rootState = useSelector((state: RootState) => state);
	const notifications = rootState.notifications;
	const dark = rootState.settings.dark;
	const dispatch = useDispatch();
  const [settingsDialog, setSettingsDialog] = useState(false);

	// To-be-removed notifications
	const [invalidNotifications, setInvalidNotifications] = useState([] as string[]);
	const handleSnackbarClose = (reason: string, notification: Notification) => {
		if (reason === "clickaway") {
			return;
		}
		setInvalidNotifications(invalidNotifications.concat([notification.id!]));

		// Wait until transition finishes
		setTimeout(() => {
			setInvalidNotifications(invalidNotifications.filter(e => e !== notification.id));
			dispatch(rootActions.removeNotification(notification.id!));
		}, duration.leavingScreen);
	};

	const handleDarkTheme = () => {
		dispatch(rootActions.updateSettings({
			dark: !dark
		}));
	};

	return (
		<>
			<AppBar className={classes.appBar} position="sticky">
				<Toolbar>
					<StickerCheckOutlineIcon className={classes.icon} />
					<Typography variant="h6" noWrap className={classes.title}>
						Task.json WebUI
					</Typography>

					<IconButton
						color="inherit"
						title={`Switch to ${dark ? "light" : "dark"} mode`}
						onClick={handleDarkTheme}
					>
						{dark && <Brightness4Icon />}
						{!dark && <Brightness7Icon />}
					</IconButton>

					<IconButton
						color="inherit"
						title="Settings"
						onClick={() => setSettingsDialog(true)}
					>
						<CogIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

      <SettingsDialog
        open={settingsDialog}
        onClose={() => setSettingsDialog(false)}
      />

			{notifications.map(notification => (
				<Snackbar
					key={notification.id}
					open={!invalidNotifications.includes(notification.id!)}
					autoHideDuration={6000}
					onClose={(_, reason) => handleSnackbarClose(reason, notification)}
				>
					<Alert
						elevation={6}
						variant="filled"
						onClose={() => handleSnackbarClose("", notification)}
						severity={notification.severity}
					>
						{notification.text}
					</Alert>
				</Snackbar>
			))}

			{props.children}
		</>
	);
}

export default Layout;
