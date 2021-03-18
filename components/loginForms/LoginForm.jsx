import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { useLogin } from '../../lib/loginContext';
import { useForm } from 'react-hook-form';

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
        <div className={classes.fieldsPosition}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CssTextField
                    type="email"
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
                <CssTextField
                    type={showPassword ? 'text' : 'password'}
                    id="password"
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
                        )
                    }}
                    InputLabelProps={{ htmlFor: 'password' }}
                    label="Mot de passe"
                    name="password"
                    inputRef={register({ required: 'Le mot de passe est obligatoire.' })}
                    error={Object.prototype.hasOwnProperty.call(errors, 'password')}
                    helperText={errors.password && errors.password.message}
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
