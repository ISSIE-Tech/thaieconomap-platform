'use client';

import type { AuthContextValue } from '../_types/auth.type';

import { createContext } from 'react';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthConsumer = AuthContext.Consumer;
