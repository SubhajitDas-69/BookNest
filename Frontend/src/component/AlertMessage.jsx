import { useEffect } from 'react';
import { Alert } from '@mui/material';

export default function AlertMessage({ alert, setAlert }) {
    useEffect(() => {
        if (alert?.msg) {
            const timer = setTimeout(() => {
                setAlert({ msg: '', severity: '' });
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [alert, setAlert]);

    if (!alert?.msg) return null;

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Alert severity={alert.severity} variant="filled" style={{ display: 'flex', justifyContent: 'center', width: '50%', position: 'fixed' }}>
                {alert.msg}
            </Alert>
        </div>

    );
}
