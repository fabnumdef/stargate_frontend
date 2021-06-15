import React from 'react';
import PropTypes from 'prop-types';
import { useLogin } from './loginContext';
import { ROLES } from '../utils/constants/enums';
import { useRouter } from 'next/router';

export function PermissionsContext({ children }) {
    const router = useRouter();
    const { activeRole } = useLogin();

    const [path] = router.pathname.split('/[');

    if (path === '/md-connect' || ROLES[activeRole.role].permission.includes(path)) {
        return children;
    }
    router.push('/');
    return <></>;
}

PermissionsContext.propTypes = {
    children: PropTypes.node.isRequired
};
