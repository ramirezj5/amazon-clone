import React, {createContext, useContext, useReducer} from "react";

//Prepares the data layer 
export const StateContext = createContext();

// Wrap our app - provide the data later 
export const StateProvider = ({reducer, initialState, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => {
    return useContext(StateContext);
}