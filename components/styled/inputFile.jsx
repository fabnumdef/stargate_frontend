import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

export default function InputFile({ type, label, onChange, error, editValue }) {
    const [formValue, setValue] = useState(editValue);

    const handleChange = (event) => {
        const { value, files } = event.target;
        setValue(value);
        onChange({ value, files: files[0] });
    };

    return (
        <>
            <label htmlFor="icon-button-file">
                <input
                    id="icon-button-file"
                    type="file"
                    name="fileVisiteur"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                <TextField
                    value={formValue}
                    error={error || false}
                    label={label}
                    helperText={error && `Le ${type} est obligatoire`}
                    InputProps={{
                        endAdornment: (
                            <IconButton aria-label="upload" component="span">
                                <AttachFileIcon />
                            </IconButton>
                        )
                    }}
                    fullWidth
                />
            </label>
        </>
    );
}

InputFile.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    editValue: PropTypes.string.isRequired
};
