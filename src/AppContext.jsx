import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';


const AppContext = createContext();


const actionTypes = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_FILTERED_PRODUCTS: 'SET_FILTERED_PRODUCTS',
  SET_CATEGORY: 'SET_CATEGORY',
};


function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case actionTypes.SET_FILTERED_PRODUCTS:
      return { ...state, filteredProducts: action.payload };
    case actionTypes.SET_CATEGORY:
      return { ...state, filterCategory: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    products: [],
    filteredProducts: [],
    filterCategory: '',
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
export { actionTypes };