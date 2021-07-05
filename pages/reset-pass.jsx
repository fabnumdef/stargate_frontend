import React, { useState } from 'react';
import { ResetPassForm } from '../components';
import LoginLayout from '../components/login/loginLayout';
import { useRouter } from 'next/router';

function ResetPass() {
    const router = useRouter();
    const [resetPass, setResetPass] = useState(() => {
        if (router.query.token && router.query.email) {
            return {
                email: router.query.email,
                token: router.query.token
            };
        }
        return null;
    });

    return (
        <LoginLayout>
            {resetPass && <ResetPassForm resetPass={resetPass} setResetPass={setResetPass} />}
        </LoginLayout>
    );
}

export default ResetPass;
