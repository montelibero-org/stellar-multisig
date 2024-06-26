"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const Context = createContext();

export const usePublic = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("usePublic must be used within a PublicProvider");
    }
    return [context.net, context.setNet];
};

const PublicProvider = ({ children }) => {
    const [net, setNetState] = useState("public"); // Default value

    useEffect(() => {
        // Check if running on the client side before accessing localStorage
        const storedNet = localStorage.getItem("net");
        if (storedNet) {
            setNetState(storedNet); // Initialize net state from localStorage if it exists
        } else {
            setNetState('public')
        }
    }, []);

    const setNet = (newNet) => {
        setNetState(newNet);
        localStorage.setItem("net", newNet); // Persist net state to localStorage
    };

    const value = {
        net,
        setNet,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PublicProvider;
