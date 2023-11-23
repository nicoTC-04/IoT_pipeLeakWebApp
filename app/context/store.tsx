'use client';

import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

interface ContextProps {
    username: string,
    setUsername: Dispatch<SetStateAction<string>>,
    idUser: number,
    setIdUser: Dispatch<SetStateAction<number>>,
}

const GlobalContext = createContext<ContextProps>({
    username: '',
    setUsername: (): string => '',
    idUser: 0,
    setIdUser: (): number => 0,
})


export const GlobalContextProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [idUser, setIdUser] = useState(0);
    
    return (
        <GlobalContext.Provider value={{ username, setUsername, idUser, setIdUser }}>
            {children}
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = () => useContext(GlobalContext);