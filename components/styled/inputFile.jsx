import React, { useState } from 'react';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

export default function InputFile(props) {
  const [value, setValue] = useState();

  const {
    label, onChange, error,
  } = props;

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
