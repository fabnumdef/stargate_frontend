import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

const OPEN_ID_LOGIN = gql`
    mutation openIDLogin($redirectURI: String!, $state: String!, $authorizationCode: String) {
        openIDLogin(
            redirectURI: $redirectURI
            state: $state
            authorizationCode: $authorizationCode
        ) {
            jwt
        }
    }
`;

function MdConnect() {
    const router = useRouter();
    const [authenticationResult, setAuthenticationResult] = useState(null);
    const [openIDLogin, { data, error }] = useMutation(OPEN_ID_LOGIN, {
        variables: {
            redirectURI: 'http://localhost/md-connect',
            state: router.query.state,
            authorizationCode: router.query.code
        },
        onCompleted: (res) => {
            console.log('res', res);
            setAuthenticationResult(AUTHENTICATION_SUCCESS);
        },
        onError: (err) => {
            console.log('err', err);
            setAuthenticationResult(AUTHENTICATION_ERROR);
        }
    });

    useEffect(() => {
        if (!data || !error) {
            openIDLogin();
        }
    }, [data]);
    return !authenticationResult && <div />;
}

export default MdConnect;
