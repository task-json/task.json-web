import { fade, Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { red } from '@material-ui/core/colors';

export const redBgStyle = (theme: Theme): CSSProperties => ({
	color: theme.palette.getContrastText(red[500]),
	backgroundColor: red[500],
	"&:hover": {
		backgroundColor: red[800]
	}
});

export const redStyle = (_theme: Theme): CSSProperties => ({
	color: red[500],
	"&:hover": {
		backgroundColor: fade(red[500], 0.05)
	}
});
