// Build-time configuration for the kagent chat integration.
//
// Values come from `globalVariables.kagentChat` in config/config.yaml (or
// config/local_config.yaml) and are injected by webpack as GLOBAL_VARIABLES.
// Users cannot change the iframe target: it is fixed per build.

export const KAGENT_CHAT_FEATURE = 'kagentchat';
export const KAGENT_CHAT_PAGE_PATH = '/kagentchat/chat';

const SEGMENT = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

const readRawConfig = () =>
  (typeof GLOBAL_VARIABLES !== 'undefined' && GLOBAL_VARIABLES.kagentChat) ||
  null;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Verified against kagent sources:
//   v1 (v1.0.x, Vite SPA): ui/src/router/routes.ts
//     new chat  /agents/:namespace/:name/new
//     existing  /agents/:id/chat   (id = AgentInstance, created on 1st message)
//   v0 (v0.10.x, Next.js): ui/src/app/agents/[namespace]/[name]/chat/...
//     new chat  /agents/:namespace/:name/chat
//     existing  /agents/:namespace/:name/chat/:chatId
const UI_ROUTES = {
  v1: (basePath, namespace, agent) => ({
    newChat: `${basePath}/agents/${namespace}/${agent}/new`,
    session: (id) => `${basePath}/agents/${id}/chat`,
    sessionPattern: new RegExp(
      `^${escapeRegExp(basePath)}/agents/([^/]+)/chat/?$`
    ),
  }),
  v0: (basePath, namespace, agent) => {
    const chat = `${basePath}/agents/${namespace}/${agent}/chat`;
    return {
      newChat: chat,
      session: (id) => `${chat}/${id}`,
      sessionPattern: new RegExp(`^${escapeRegExp(chat)}/([^/]+)/?$`),
    };
  },
};

const trimSlash = (value) => value.replace(/\/+$/, '');

// Accept an absolute http(s) URL or a same-origin absolute path. Reject
// protocol-relative ("//host"), javascript:, data: and other schemes.
const parseBaseUrl = (value, origin) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const raw = value.trim();
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return new URL(trimSlash(raw) || '/', origin);
  }
  if (!/^https?:\/\//i.test(raw)) return null;
  try {
    const url = new URL(raw);
    if (url.username || url.password || url.search || url.hash) return null;
    return url;
  } catch (e) {
    return null;
  }
};

// Returns { status, ...config }:
//   status 'disabled' -> no kagentChat block configured at all
//   status 'invalid'  -> configured but unusable; `error` explains why
//   status 'ok'       -> `chatUrl` (new chat) and `origin` are safe to use
export const getKagentChatConfig = (
  raw = readRawConfig(),
  origin = window.location.origin
) => {
  if (!raw || typeof raw !== 'object' || !raw.url) {
    return { status: 'disabled' };
  }
  const base = parseBaseUrl(raw.url, origin);
  if (!base) {
    return {
      status: 'invalid',
      error:
        'kagentChat.url must be an http(s) URL or a path starting with "/".',
    };
  }
  const { namespace, agent } = raw;
  if (!SEGMENT.test(namespace || '') || !SEGMENT.test(agent || '')) {
    return {
      status: 'invalid',
      error:
        'kagentChat.namespace and kagentChat.agent must be Kubernetes resource names.',
    };
  }
  const uiVersion = raw.uiVersion === undefined ? 'v1' : raw.uiVersion;
  if (!UI_ROUTES[uiVersion]) {
    return {
      status: 'invalid',
      error: 'kagentChat.uiVersion must be "v1" or "v0".',
    };
  }
  const basePath = trimSlash(base.pathname);
  const routes = UI_ROUTES[uiVersion](basePath, namespace, agent);
  const chatUrl = `${base.origin}${routes.newChat}`;
  const allowedRoles = Array.isArray(raw.allowedRoles)
    ? raw.allowedRoles.filter((it) => typeof it === 'string' && it)
    : [];
  return {
    status: 'ok',
    chatUrl,
    origin: base.origin,
    uiVersion,
    sessionPath: routes.session,
    sessionPattern: routes.sessionPattern,
    namespace,
    agent,
    allowedRoles,
  };
};

// Empty allowedRoles means every signed-in Skyline user may use the chat.
// This is a UI gate only; real access control belongs to the reverse proxy.
export const hasKagentChatRole = (config, roles = []) => {
  if (!config || !config.allowedRoles || !config.allowedRoles.length) {
    return true;
  }
  const names = (roles || []).map((it) => (it && it.name) || it);
  return config.allowedRoles.some((role) => names.includes(role));
};

// kagent session ids are opaque; only accept URL-safe tokens so a crafted
// ?session= value cannot change the iframe path.
const SESSION_ID = /^[A-Za-z0-9_-]{1,128}$/;

export const isValidSessionId = (value) =>
  typeof value === 'string' && SESSION_ID.test(value);

export const getSessionChatUrl = (config, session) =>
  isValidSessionId(session)
    ? `${config.origin}${config.sessionPath(session)}`
    : config.chatUrl;

export const isKagentChatPage = (pathname = '') =>
  pathname === KAGENT_CHAT_PAGE_PATH ||
  pathname === `${KAGENT_CHAT_PAGE_PATH}-admin`;

export const getKagentChatPagePath = ({ admin = false, session } = {}) => {
  const path = `${KAGENT_CHAT_PAGE_PATH}${admin ? '-admin' : ''}`;
  return isValidSessionId(session)
    ? `${path}?session=${encodeURIComponent(session)}`
    : path;
};

// Reads the current kagent conversation id from the iframe's own URL (kagent
// replaces the URL after the first message). This only works when kagent is
// served from the same origin as Skyline (reverse proxy); cross-origin frames
// throw and the caller falls back to a new chat. kagent sends no postMessage.
export const getSessionFromFrame = (frame, config) => {
  try {
    const { origin, pathname } = frame.contentWindow.location;
    if (origin !== config.origin) return undefined;
    const match = config.sessionPattern.exec(pathname);
    return match && isValidSessionId(match[1]) ? match[1] : undefined;
  } catch (e) {
    return undefined;
  }
};
