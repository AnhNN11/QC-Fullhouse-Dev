'use client';

// Next Link uses the History API, which does not emit hashchange.
// Subscribe to committed URL changes as well as native hash/back navigation.
export function subscribeLocation(notify: () => void) {
  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;
  const push: History['pushState'] = function (this: History, ...args) {
    originalPush.apply(this, args);
    notify();
  };
  const replace: History['replaceState'] = function (this: History, ...args) {
    originalReplace.apply(this, args);
    notify();
  };
  window.history.pushState = push;
  window.history.replaceState = replace;
  window.addEventListener('hashchange', notify);
  window.addEventListener('popstate', notify);
  return () => {
    window.removeEventListener('hashchange', notify);
    window.removeEventListener('popstate', notify);
    if (window.history.pushState === push) window.history.pushState = originalPush;
    if (window.history.replaceState === replace) window.history.replaceState = originalReplace;
  };
}

export const getLocationHash = () => window.location.hash;
export const getServerHash = () => '';

export function isLearningLinkActive(href: string, pathname: string, hash: string) {
  if (href === '/dashboard#practice') return pathname === '/dashboard' && hash === '#practice';
  if (href === '/dashboard') return pathname === '/dashboard' && hash !== '#practice';
  return pathname === href || pathname.startsWith(href + '/');
}
