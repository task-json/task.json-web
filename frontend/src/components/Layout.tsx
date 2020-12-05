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
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, rootActions } from "../store";
import { Notification } from "../types";
import {
	Cog,
	StickerCheckOutline
} from "mdi-material-ui";

type Props = {
	children?: any
};

const useStyles = makeStyles(theme => ({
	icon: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	}
}));

function Layout(props: Props) {
	const classes = useStyles();
	const notifications = useSelector((state: RootState) => state.notifications)
	const dispatch = useDispatch();

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

	return (
		<Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<StickerCheckOutline className={classes.icon} />
					<Typography variant="h6" noWrap className={classes.title}>
						Todo.txt
					</Typography>

					<IconButton color="inherit" title="Settings">
						<Cog />
					</IconButton>
				</Toolbar>
			</AppBar>

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
		</Fragment>
	);
}

export default Layout;
