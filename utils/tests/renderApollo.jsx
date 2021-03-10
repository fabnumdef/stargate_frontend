import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { MockedProvider, MockLink } from '@apollo/client/testing';
import { addTypenameToDocument, Observable } from '@apollo/client/utilities';
import { ThemeProvider } from '@material-ui/core/styles';
// disable eslint - this imports are good for tests, but not in a test file
import { render } from '@testing-library/react';
import { equal } from '@wry/equality';
import { print } from 'graphql/language/printer';

import { SnackBarProvider } from '../../lib/hooks/snackbar';
import theme from '../../styles/theme';

function requestToKey(request, addTypename) {
    const queryString =
        request.query && print(addTypename ? addTypenameToDocument(request.query) : request.query);
    const requestKey = { query: queryString };
    return JSON.stringify(requestKey);
}
class MyMockLink extends MockLink {
    request(operation) {
        this.operation = operation;
        const key = requestToKey(operation, this.addTypename);
        let responseIndex = 0;
        const diffs = [];
        const response = (this.mockedResponsesByKey[key] || []).find((res, index) => {
            const requestVariables = operation.variables || {};
            const mockedResponseVariables = res.request.variables || {};
            if (equal(requestVariables, mockedResponseVariables)) {
                responseIndex = index;
                return true;
            }
            diffs.push(mockedResponseVariables);
            return false;
        });

        if (!response || typeof responseIndex === 'undefined') {
            const replacer = (_, value) => (typeof value === 'undefined' ? 'undefined' : value);
            const error = new Error(
                `No more mocked responses for the query: ${print(
                    operation.query
                )}\nExpected variables:\n\t${JSON.stringify(operation.variables, replacer)}${
                    diffs.length > 0
                        ? `\nFound ${diffs.length} mock${
                              diffs.length > 1 ? 's' : ''
                          } with variables:\n${diffs.map(
                              (d, i) => `\t${i + 1}: ${JSON.stringify(d, replacer)}\n`
                          )}`
                        : ''
                }`
            );
            this.onError(error);
            return null;
        }

        this.mockedResponsesByKey[key].splice(responseIndex, 1);

        const { newData } = response;

        if (newData) {
            response.result = newData();
            this.mockedResponsesByKey[key].push(response);
        }

        const { result, error, delay } = response;

        if (!result && !error) {
            this.onError(
                new Error(`Mocked response should contain either result or error: ${key}`)
            );
        }

        return new Observable((observer) => {
            const timer = setTimeout(() => {
                if (error) {
                    observer.error(error);
                } else {
                    if (result) {
                        observer.next(typeof result === 'function' ? result() : result);
                    }
                    observer.complete();
                }
            }, delay || 0);

            return () => {
                clearTimeout(timer);
            };
        });
    }
}

const renderApollo = (
    node,
    { mocks, defaultOptions, cache, addTypename, resolvers, ...options } = {}
) => {
    const mockLink = new MyMockLink(mocks);
    return {
        ...render(
            <MockedProvider
                addTypename={addTypename || false}
                link={mockLink}
                cache={cache}
                defaultOptions={defaultOptions}
                resolvers={resolvers}>
                <ThemeProvider theme={theme}>
                    <SnackBarProvider>{node}</SnackBarProvider>
                </ThemeProvider>
            </MockedProvider>
        ),
        options
    };
};
export * from '@testing-library/react';
export { renderApollo as render };
