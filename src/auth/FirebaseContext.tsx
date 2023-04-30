import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import firebase from "firebase/compat/app";
import {
  getAuth,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
// config
import { FIREBASE_API } from '../config-global';
//
import { ActionMapType, AuthStateType, AuthUserType, FirebaseContextType } from './types';
import axios from "axios";
import Router from 'next/router';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<FirebaseContextType | null>(null);

// ----------------------------------------------------------------------

const firebaseApp = firebase.initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

export const DB = getFirestore(firebaseApp);

const GOOGLE_PROVIDER = new GoogleAuthProvider();

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, 'users', user.uid);

          const docSnap = await getDoc(userRef);

          const profile = docSnap.data();

          dispatch({
            type: Types.INITIAL,
            payload: {
              isAuthenticated: true,
              user: {
                ...user,
                ...profile,
                role: 'admin',
              },
            },
          });
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback((email: string, password: string) => {
    signInWithEmailAndPassword(AUTH, email, password);
  }, []);

  const loginWithGoogle = useCallback(() => {
    signInWithPopup(AUTH, GOOGLE_PROVIDER).then(async (res) => {
      const userRef = doc(collection(DB, 'users'), res.user?.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        Router.push('/')
      } else {
        await setDoc(userRef, {
          uid: res.user?.uid,
          userName: res.user?.displayName,
          userEmail: res.user?.email,
          chatrooms: {}
        });
      }
    })
  }, []);

  // REGISTER
  const register = useCallback(
    (email: string, password: string, firstName: string, lastName: string) => {
      createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
        // await res.user?.updateProfile({
        //   displayName: `${firstName} ${lastName}`
        // });

        const userRef = doc(collection(DB, 'users'), res.user?.uid);
        
        await setDoc(userRef, {
          uid: res.user?.uid,
          userName: `${firstName} ${lastName}`,
          userEmail: email,
          chatrooms: {}
        });
      });
    },
    []
  );

  // RESET PASSWORD
  const resetPassword = useCallback((email: string) => {
    sendPasswordResetEmail(AUTH, email)
  }, [])

  // LOGOUT
  const logout = useCallback(() => {
    signOut(AUTH);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'firebase',
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
