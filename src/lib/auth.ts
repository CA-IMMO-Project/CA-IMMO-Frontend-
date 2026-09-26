import { useSyncExternalStore } from 'react';

/* ==========================================================================
   Authentification « front non connecté » — comptes locaux (localStorage).
   Migrable facilement vers un vrai backend plus tard (mêmes signatures).
   ========================================================================== */

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

const USERS_KEY = 'caimmo.users';
const SESSION_KEY = 'caimmo.session';

/* Démo uniquement : en production, le mot de passe ne quitte jamais le backend. */
function hashPassword(password: string): string {
  return btoa(`caimmo::${password}`);
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* stockage indisponible */
  }
}

function toPublic(u: StoredUser): AuthUser {
  const { password: _password, ...rest } = u;
  return rest;
}

/* --- Petit store réactif (pour useSyncExternalStore) --- */

const listeners = new Set<() => void>();
let cache: { sessionRaw: string; user: AuthUser | null } | null = null;

function emit() {
  cache = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AuthUser | null {
  let sessionRaw = '';
  try {
    sessionRaw = localStorage.getItem(SESSION_KEY) ?? '';
  } catch {
    sessionRaw = '';
  }
  if (cache && cache.sessionRaw === sessionRaw) return cache.user;
  const stored = sessionRaw ? readUsers().find((u) => u.id === sessionRaw) : undefined;
  cache = { sessionRaw, user: stored ? toPublic(stored) : null };
  return cache.user;
}

/* --- Actions --- */

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: AuthUser;
}

export function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): AuthResult {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || !input.firstName.trim()) {
    return { ok: false, error: 'Merci de compléter tous les champs obligatoires.' };
  }
  if (input.password.length < 6) {
    return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
  }
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: 'Un compte existe déjà avec cette adresse email.' };
  }
  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    fullName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email,
    phone: input.phone.trim(),
    createdAt: new Date().toISOString(),
    password: hashPassword(input.password),
  };
  writeUsers([...users, user]);
  try {
    localStorage.setItem(SESSION_KEY, user.id);
  } catch {
    /* ignore */
  }
  emit();
  return { ok: true, user: toPublic(user) };
}

export function login(email: string, password: string): AuthResult {
  const stored = readUsers().find((u) => u.email === email.trim().toLowerCase());
  if (!stored || stored.password !== hashPassword(password)) {
    return { ok: false, error: 'Email ou mot de passe incorrect.' };
  }
  try {
    localStorage.setItem(SESSION_KEY, stored.id);
  } catch {
    /* ignore */
  }
  emit();
  return { ok: true, user: toPublic(stored) };
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function updateProfile(input: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}): AuthResult {
  let id = '';
  try {
    id = localStorage.getItem(SESSION_KEY) ?? '';
  } catch {
    id = '';
  }
  if (!id) return { ok: false, error: 'Session expirée, merci de vous reconnecter.' };
  const email = input.email.trim().toLowerCase();
  if (!email || !input.firstName.trim()) {
    return { ok: false, error: 'Merci de compléter tous les champs obligatoires.' };
  }
  const users = readUsers();
  if (users.some((u) => u.email === email && u.id !== id)) {
    return { ok: false, error: 'Un compte existe déjà avec cette adresse email.' };
  }
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { ok: false, error: 'Compte introuvable.' };
  const updated: StoredUser = {
    ...users[idx],
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    fullName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email,
    phone: input.phone.trim(),
  };
  const next = [...users];
  next[idx] = updated;
  writeUsers(next);
  emit();
  return { ok: true, user: toPublic(updated) };
}

export function changePassword(currentPassword: string, newPassword: string): AuthResult {
  let id = '';
  try {
    id = localStorage.getItem(SESSION_KEY) ?? '';
  } catch {
    id = '';
  }
  if (!id) return { ok: false, error: 'Session expirée, merci de vous reconnecter.' };
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { ok: false, error: 'Compte introuvable.' };
  if (users[idx].password !== hashPassword(currentPassword)) {
    return { ok: false, error: 'Le mot de passe actuel est incorrect.' };
  }
  if (newPassword.length < 6) {
    return { ok: false, error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' };
  }
  const next = [...users];
  next[idx] = { ...users[idx], password: hashPassword(newPassword) };
  writeUsers(next);
  return { ok: true };
}

export function currentUser(): AuthUser | null {
  return getSnapshot();
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return { user, register, login, logout, updateProfile, changePassword };
}
