import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currUser, setCurrUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://booknest-3ev5.onrender.com/api/current-user', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCurrUser(data.user || null);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ currUser, setCurrUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
