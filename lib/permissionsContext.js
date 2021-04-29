import { useLogin } from './loginContext';
import { ROLES } from '../utils/constants/enums';
import { useRouter } from 'next/router';

export function PermissionsContext({ children }) {
    const router = useRouter();
    const { activeRole } = useLogin();

    const [path] = router.pathname.split('/[');

    if (!ROLES[activeRole.role].permission.includes(path)) {
        router.push('/');
        return <></>;
    }

    return children;
}
