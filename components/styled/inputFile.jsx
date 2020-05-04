import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

export default function InputFile({
  label, onChange, error,
}) {
  const [value, setValue] = useState();

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor="icon-button-file">
        <input
          label={label}
          id="icon-button-file"
          type="file"
          name="fileVisiteur"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <TextField
          value={value || ''}
          error={error || false}
          helperText={error && `Le ${label} est obligatoire`}
          InputProps={{
            endAdornment: (
              <IconButton aria-label="upload" component="span">
                <AttachFileIcon />
              </IconButton>
            ),
          }}
          fullWidth
        />
      </label>

    </>
  );
}

InputFile.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};
