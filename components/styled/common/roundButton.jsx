import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const RoundButton = withStyles({
    root: { borderRadius: 20 }
})(Button);

export default RoundButton;
