import React from 'react';
import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import frLocale from 'date-fns/locale/fr';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'd MMM yyyy', { locale: this.locale });
    }
}

export default function DatePicker(props) {
    return (
        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={frLocale}>
            <KeyboardDatePicker
                autoOk
                variant="inline"
                format="dd/MM/yyyy"
                // All props are needed by Material-Ui, and never the same, depending on the import
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
            />
        </MuiPickersUtilsProvider>
    );
}
