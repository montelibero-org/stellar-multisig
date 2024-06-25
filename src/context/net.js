"use client";

import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const usePublic = () => useContext(Context);

const PublicProvider = ({ children }) => {
    const [net, setNet] = useState("public");

    const value = {
        net,
        setNet,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PublicProvider;
