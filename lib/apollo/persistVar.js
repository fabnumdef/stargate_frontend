import { makeVar } from '@apollo/client';
import { isString } from 'lodash';

const getCleanValueForStorage = (value) => {
    return isString(value) ? value : JSON.stringify(value);
};

const makeVarPersisted = (initialValue, config) => {
    const rv = makeVar(initialValue);

    const rvFn = function (newValue) {
        if (arguments.length > 0) {
            try {
                config?.storage.setItem(config.storageKey, getCleanValueForStorage(newValue));

                return rv(newValue);
            } catch {
                // ignore
            }
        } else {
            return rv();
        }
    };

    const restore = async () => {
        try {
            const previousValue = await config?.storage.getItem(config.storageKey);

            if (previousValue) {
                rv(isString(initialValue) ? previousValue : JSON.parse(previousValue));
            }
        } catch {
            // ignore
        }
    };

    rvFn.onNextChange = rv.onNextChange;

    return [rvFn, restore];
};

export default makeVarPersisted;
