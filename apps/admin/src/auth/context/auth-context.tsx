'use client';

import type { AuthContextValue } from '../types';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthConsumer = AuthContext.Consumer;
