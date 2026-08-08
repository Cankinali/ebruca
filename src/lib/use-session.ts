'use client';

import { useEffect, useState } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}

interface SessionState {
  user: SessionUser | null;
  /** İlk istek tamamlanana kadar true — "giriş yapılmamış" ile karıştırmamak için. */
  loading: boolean;
}

/**
 * Oturum durumunu istemci tarafında okur.
 *
 * Kök layout bilerek statik tutuluyor (cookies() okunsaydı tüm sayfalar dinamik
 * render'a düşerdi), bu yüzden oturum bilgisi hydration sonrası çekiliyor.
 */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });

  useEffect(() => {
    let active = true;

    fetch('/api/auth/ben')
      .then(res => (res.ok ? res.json() : { user: null }))
      .then(data => {
        if (active) setState({ user: data.user ?? null, loading: false });
      })
      .catch(() => {
        if (active) setState({ user: null, loading: false });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
