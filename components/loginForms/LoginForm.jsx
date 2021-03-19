import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { useLogin } from '../../lib/loginContext';
import { useForm } from 'react-hook-form';
import RoundButton from '../styled/common/roundButton';

const useStyles = makeStyles((theme) => ({
    submitButton: {
        margin: theme.spacing(3, 0, 2),
        padding: '6px 35px'
    }
}));

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { signIn } = useLogin();

    const { register, handleSubmit, errors } = useForm();

    const classes = useStyles();

    const onSubmit = ({ email, password }) => {
        signIn(email, password);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (evt) => {
        evt.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
            <TextField
                className={classes.textFieldStyle}
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                name="email"
                inputProps={{ 'aria-label': 'email' }}
                label="Email"
                inputRef={register({
                    required: "L'adresse mail est obligatoire."
                    // validate: (value) => validator.isEmail(value) || 'Format invalide',
                })}
                error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                helperText={errors.email && errors.email.message}
            />
            <TextField
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                id="password"
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                InputLabelProps={{ htmlFor: 'password' }}
                label="Mot de passe"
                name="password"
                inputRef={register({ required: 'Le mot de passe est obligatoire.' })}
                error={Object.prototype.hasOwnProperty.call(errors, 'password')}
                helperText={errors.password && errors.password.message}
            />
            <RoundButton
                className={classes.submitButton}
                variant="contained"
                color="primary"
                type="submit">
                Se connecter
            </RoundButton>
        </form>
    );
}
