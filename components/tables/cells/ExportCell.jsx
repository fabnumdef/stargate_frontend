import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useExport } from '../../../lib/hooks/useExportBA';

export default function ExportCell({ visitor }) {
    const { visitors, addVisitors, removeVisitors } = useExport();

    const dateTransform = () => {
        let lastExport = new Date(visitor.exportDate);
        const dd = String(lastExport.getDate()).padStart(2, '0');
        const mm = String(lastExport.getMonth() + 1).padStart(2, '0');
        const yyyy = lastExport.getFullYear();
        lastExport = `${dd}/${mm}/${yyyy}`;
        return lastExport;
    };

    const handleChange = () => {
        visitors.includes(visitor.id) ? removeVisitors(visitor.id) : addVisitors(visitor.id);
    };
    return (
        <TableCell style={{ width: '105px' }}>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={visitors.includes(visitor.id)}
                            onChange={handleChange}
                        />
                    }
                    label={dateTransform()}
                />
            </FormGroup>
        </TableCell>
    );
}

ExportCell.propTypes = {
    visitor: PropTypes.shape({
        id: PropTypes.string.isRequired,
        exportDate: PropTypes.string.isRequired
    }).isRequired
};
