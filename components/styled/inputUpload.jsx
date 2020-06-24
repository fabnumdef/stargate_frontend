import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
}));

export default function InputUpload({ onChange }) {
  const [file] = React.useState();

  const classes = useStyles();

  React.useEffect(() => {
    onChange(file);
  }, [file, onChange]);

  return (
    <>
      <label htmlFor="icon-button-file">
        <input
          className={classes.input}
          id="icon-button-file"
          type="file"
          name="fileVisiteur"
        />
        <TextField value={file || ''} />

        <IconButton aria-label="upload" component="span">
          <AttachFileIcon />
        </IconButton>
      </label>
    </>
  );
}

InputUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
};
