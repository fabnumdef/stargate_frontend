import { InMemoryCache, makeVar } from '@apollo/client';

import { checkScreenedVisitor } from '../../utils';
import makeVarPersisted from './persistVar';

function merge(existing, incoming, { args }) {
    if (!args?.cursor) return incoming;

    // if export method replace old value in the cache
    if (existing?.generateCSVExportLink) return incoming;

    const merged = existing ? { ...existing, list: [...existing.list] } : { ...incoming, list: [] };

    /** Insert the incoming elements in the right places, according to args. */
    if (args?.cursor) {
        let _b = args.cursor.offset,
            offset = _b === 0 ? 0 : _b;
        for (let i = 0; i < incoming.list.length; ++i) {
            merged.list[offset + i] = incoming.list[i];
        }
    }
    return merged;
}

function read(existing, { args, readField, isReference }) {
    // If we read the field before any data has been written to the
    // cache, this function will return undefined, which correctly
    // indicates that the field is missing.
    let page;

    if (!args?.cursor) return existing;

    if (existing?.list) {
        page = existing.list.slice(0);

        if (args?.search) {
            page = page.filter((entry) => {
                if (isReference(entry))
                    return (
                        readField('firstname', entry).includes(args?.search) ||
                        readField('birthLastname', entry).includes(args?.search)
                    );
            });
        }

        // cursor
        page = page.slice(args.cursor.offset, args.cursor.offset + args.cursor.first);
    }

    // If we ask for a page outside the bounds of the existing array,
    // page.length will be 0, and we should return undefined instead of
    // the empty array.
    if (page) {
        return { ...existing, list: page };
    }
    return undefined;
}

export const typePolicies = {
    Query: {
        fields: {
            isLoggedIn: {
                read() {
                    return isLoggedInVar();
                }
            },
            campusId: {
                read() {
                    return campusIdVar();
                }
            },
            activeRoleCache: {
                read() {
                    return activeRoleCacheVar();
                }
            },
            listUsers: {
                keyArgs: ['campus', 'hasRole', 'search'],
                merge,
                read: (existing, { args, readField, isReference }) => {
                    // If we read the field before any data has been written to the
                    // cache, this function will return undefined, which correctly
                    // indicates that the field is missing.
                    let page;

                    if (!args?.cursor) return existing;

                    if (existing?.list) {
                        page = existing.list.slice(0);

                        if (args?.search) {
                            page = page.filter((entry) => {
                                if (isReference(entry)) {
                                    const { original: email } = readField('email', entry);
                                    return email.toLowerCase().includes(args?.search.toLowerCase());
                                }
                            });

                            // cursor
                            page = page.slice(
                                args.cursor.offset,
                                args.cursor.offset + args.cursor.first
                            );
                        }
                    }

                    // If we ask for a page outside the bounds of the existing array,
                    // page.length will be 0, and we should return undefined instead of
                    // the empty array.
                    if (page) {
                        return { ...existing, list: page };
                    }
                    return undefined;
                }
            }
        }
    },
    Campus: {
        fields: {
            listVisitorsToValidate: {
                keyArgs: false,
                merge,
                read
            },
            listVisitors: {
                keyArgs: ['isDone', ['value'], 'filters', 'visitorsId'],
                merge,
                read
            },
            listMyRequests: {
                keyArgs: ['filters'],
                merge,
                read
            },
            listRequestByVisitorStatus: {
                keyArgs: ['isDone'],
                merge,
                read
            }
        }
    },
    Request: {
        fields: {
            listVisitors: {
                keyArgs: false,
                merge,
                read
            }
        }
    },
    RequestVisitor: {
        fields: {
            isScreened: {
                read(_, { readField }) {
                    const units = readField('units');
                    return checkScreenedVisitor(units);
                }
            }
        }
    }
};

/**  Boolean to check if is Logged */
export const isLoggedInVar = makeVar(false);

/**  User's Campus id */
export const [campusIdVar, restoreCampusIdVar] = makeVarPersisted('', {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    storageKey: 'campusId'
});

/**  User's activeRole */
export const [activeRoleCacheVar, restoreActiveRoleCacheVar] = makeVarPersisted(
    {},
    {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        storageKey: 'activeRole'
    }
);

export default new InMemoryCache({ typePolicies });
