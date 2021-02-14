import { Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { red } from '@material-ui/core/colors';

export const errorStyle = (theme: Theme): CSSProperties => ({
	color: theme.palette.getContrastText(red[500]),
	backgroundColor: red[500],
	"&:hover": {
		backgroundColor: red[800]
	}
});
