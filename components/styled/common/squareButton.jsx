import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

export default withStyles(() => ({
    root: {
        color: 'inherit',
        lineBreak: 'pre-line',
        borderRadius: '15%',
        padding: '8px'
    }
}))(IconButton);
