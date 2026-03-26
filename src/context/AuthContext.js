import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ApiRequestError, getUserProfile, syncGoogleUser } from '../services/api';
import { getStoredOrders, mergeOrders, saveOrderForUser } from '../utils/orderStorage';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'web-ban-hang-google-user';
const GOOGLE_SCRIPT_ID = 'google-identity-services';

const parseJwtPayload = (credential) => {
  try {
    const [, payload] = credential.split('.');
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = window.atob(normalized);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Khong the giai ma Google credential', error);
    return null;
  }
};

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser);
    return {
      ...parsedUser,
      orders: mergeOrders(parsedUser.orders || [], getStoredOrders(parsedUser.id)),
    };
  });
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const buildLocalUser = useCallback((payload) => ({
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    avatar: payload.picture,
    provider: 'google',
    orders: getStoredOrders(payload.sub),
  }), []);

  useEffect(() => {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!clientId) {
      setAuthError('Thiếu REACT_APP_GOOGLE_CLIENT_ID để bật đăng nhập Google.');
      return;
    }

    let isMounted = true;

    const initializeGoogleIdentity = async () => {
      try {
        await loadGoogleScript();

        if (!isMounted || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            const payload = parseJwtPayload(credential);

            if (!payload) {
              setAuthError('Không thể đọc thông tin tài khoản Google.');
              return;
            }

            try {
              const savedUser = await syncGoogleUser({
                googleId: payload.sub,
                name: payload.name,
                email: payload.email,
                avatar: payload.picture,
              });

              setUser({
                ...savedUser,
                orders: mergeOrders(savedUser.orders || [], getStoredOrders(savedUser.id)),
              });
              setAuthError('');
            } catch (error) {
              console.error('Khong the dong bo nguoi dung len server', error);
              if (error instanceof ApiRequestError && error.code === 'NETWORK_ERROR') {
                setUser(buildLocalUser(payload));
                setAuthError('Đã đăng nhập Google cục bộ. API server chưa chạy nên chưa đồng bộ tài khoản.');
                return;
              }

              setAuthError(error.message || 'Không thể đăng nhập với máy chủ.');
            }
          },
        });

        setIsGoogleReady(true);
        setAuthError('');
      } catch (error) {
        console.error('Khong the tai Google Identity Services', error);
        if (isMounted) {
          setAuthError('Không tải được Google Identity Services. Kiểm tra kết nối mạng và cấu hình OAuth.');
        }
      }
    };

    initializeGoogleIdentity();

    return () => {
      isMounted = false;
    };
  }, [buildLocalUser, clientId]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    const refreshUserProfile = async () => {
      try {
        const profile = await getUserProfile(user.id);
        if (isMounted) {
          setUser((currentUser) => ({
            ...currentUser,
            ...profile,
            orders: mergeOrders(profile.orders || [], getStoredOrders(profile.id || currentUser?.id)),
          }));
        }
      } catch (error) {
        if (!(error instanceof ApiRequestError && error.code === 'NETWORK_ERROR')) {
          console.error('Khong the tai ho so tu server', error);
        }
      }
    };

    refreshUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const renderGoogleButton = useCallback((element) => {
    if (!element || !isGoogleReady || !window.google?.accounts?.id || user) {
      return;
    }

    element.innerHTML = '';
    window.google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      width: 280,
      logo_alignment: 'left',
    });
  }, [isGoogleReady, user]);

  const signOut = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    setUser(null);
  }, []);

  const recordOrder = useCallback((order, targetUserId) => {
    const resolvedUserId = targetUserId || user?.id;

    if (!resolvedUserId) {
      return;
    }

    const orders = saveOrderForUser(resolvedUserId, order);

    if (user?.id === resolvedUserId) {
      setUser((currentUser) => currentUser ? {
        ...currentUser,
        orders,
      } : currentUser);
    }
  }, [user?.id]);

  const value = useMemo(() => ({
    user,
    isGoogleReady,
    authError,
    clientId,
    renderGoogleButton,
    signOut,
    recordOrder,
  }), [authError, clientId, isGoogleReady, recordOrder, renderGoogleButton, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
