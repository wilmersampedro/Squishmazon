import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export const UpdatedContext = createContext();

export const UpdatedProvider = ({ children }) => {
  const [hasUpdated, setHasUpdated] = useState(false);

  return (

    <UpdatedContext.Provider value={{hasUpdated, setHasUpdated}}>
      {children}
    </UpdatedContext.Provider>
  )
}
