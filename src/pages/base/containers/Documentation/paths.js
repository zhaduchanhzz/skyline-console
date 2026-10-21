export const getDocsRoot = () =>
  typeof window !== 'undefined' &&
  /^\/base\/docs-admin(?:\/|$)/.test(window.location.pathname)
    ? '/base/docs-admin'
    : '/base/docs';

export const topicPath = (slug) => `${getDocsRoot()}/${slug}`;
