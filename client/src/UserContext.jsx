import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/profile', { withCredentials: true });
                setUser(data);
                setReady(true);
            } catch (error) {
                console.error('Error fetching user profile in usercontext.jsx:', error);
                // setUser(null);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
