// Runtime configuration for the kagent chat integration.
//
// Values come from the `kagent_chat` block of skyline.yaml, which
// skyline-apiserver returns with GET /api/v1/features (featureStore.kagentChat).
// Users cannot change the iframe target: it is fixed by the deployment.

export const KAGENT_CHAT_FEATURE = 'kagentchat';
export const KAGENT_CHAT_PAGE_PATH = '/kagentchat/chat';

const SEGMENT = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

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

// `url` may also be the agent's new-chat link copied from kagent, e.g.
// https://kagent.example.com/agents/kagent/chat-agent/chat (v0) or .../new
// (v1). Split it into base path, namespace, agent and UI version.
const CHAT_LINK = /^(.*)\/agents\/([^/]+)\/([^/]+)\/(chat|new)\/?$/;
const LINK_VERSION = { chat: 'v0', new: 'v1' };

const splitChatLink = (pathname) => {
  const match = CHAT_LINK.exec(pathname);
  if (!match) return null;
  const [, basePath, namespace, agent, kind] = match;
  return { basePath, namespace, agent, uiVersion: LINK_VERSION[kind] };
};

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
//   status 'disabled' -> no kagent_chat block in skyline.yaml
//   status 'invalid'  -> configured but unusable; `error` explains why
//   status 'ok'       -> `chatUrl` (new chat) and `origin` are safe to use
export const getKagentChatConfig = (
  settings = null,
  origin = window.location.origin
) => {
  if (!settings || typeof settings !== 'object' || !settings.url) {
    return { status: 'disabled' };
  }
  // skyline.yaml keys are snake_case; the API sends null for unset keys.
  const pick = (key) => (settings[key] === null ? undefined : settings[key]);
  const raw = {
    url: settings.url,
    namespace: pick('namespace'),
    agent: pick('agent'),
    uiVersion: pick('ui_version'),
    allowedRoles: pick('allowed_roles'),
  };
  const base = parseBaseUrl(raw.url, origin);
  if (!base) {
    return {
      status: 'invalid',
      error:
        'kagent_chat.url must be an http(s) URL or a path starting with "/".',
    };
  }
  const link = splitChatLink(base.pathname);
  const fromLink = (key) => {
    if (!link) return { value: raw[key] };
    if (raw[key] !== undefined && raw[key] !== link[key]) {
      return { conflict: true };
    }
    return { value: link[key] };
  };
  const ns = fromLink('namespace');
  const ag = fromLink('agent');
  const ver = fromLink('uiVersion');
  if (ns.conflict || ag.conflict || ver.conflict) {
    return {
      status: 'invalid',
      error:
        'kagent_chat.namespace, agent and ui_version must match the chat link in kagent_chat.url.',
    };
  }
  const namespace = ns.value;
  const agent = ag.value;
  if (!SEGMENT.test(namespace || '') || !SEGMENT.test(agent || '')) {
    return {
      status: 'invalid',
      error:
        'kagent_chat.namespace and kagent_chat.agent must be Kubernetes resource names.',
    };
  }
  const uiVersion = ver.value === undefined ? 'v1' : ver.value;
  if (!UI_ROUTES[uiVersion]) {
    return {
      status: 'invalid',
      error: 'kagent_chat.ui_version must be "v1" or "v0".',
    };
  }
  const basePath = trimSlash(link ? link.basePath : base.pathname);
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
