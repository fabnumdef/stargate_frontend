import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { useLogin } from '../../lib/loginContext';

export const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white'
        },
        '& .MuiFormLabel-root': {
            color: 'white'
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'grey'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white'
        },
        '& label.Mui-root': {
            color: 'white'
        },
        '& .MuiInputBase-input': {
            color: 'white'
        },
        width: '60%'
    }
})(TextField);

const useStyles = makeStyles(() => ({
    submitButton: {
        marginTop: '5%',
        width: '50%'
    },
    fieldsPosition: {
        marginTop: '25%'
    },
    showPasswordIcon: {
        color: 'white'
    }
}));

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const ctx = useLogin();

    const classes = useStyles();

    const handleSubmit = (evt) => {
        evt.preventDefault();
        ctx.signIn(email, password);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (evt) => {
        evt.preventDefault();
    };

    return (
        <div className={classes.fieldsPosition}>
            <form onSubmit={handleSubmit} data-testid="login-form">
                <CssTextField
                    type="email"
                    name="email"
                    inputProps={{ 'data-testid': 'login-form-email' }}
                    label="Email"
                    value={email}
                    onChange={(evt) => setEmail(evt.target.value)}
                />
                <CssTextField
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    className={classes.showPasswordIcon}
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        inputProps: { 'data-testid': 'login-form-password' }
                    }}
                    label="Mot de passe"
                    value={password}
                    onChange={(evt) => setPassword(evt.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submitButton}>
                    Login
                </Button>
            </form>
        </div>
    );
}
