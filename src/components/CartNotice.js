import React from 'react';
import { useCart } from '../hooks/useCart';

export default function CartNotice() {
  const { notice, clearNotice } = useCart();

  React.useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearNotice();
    }, 2400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clearNotice, notice]);

  if (!notice) {
    return null;
  }

  return (
    <div className="cart-notice" role="status" aria-live="polite">
      {notice}
    </div>
  );
}
