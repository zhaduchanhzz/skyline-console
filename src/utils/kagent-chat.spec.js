import { isFeatureEnabled, isPathEnabled } from './features';
import {
  getKagentChatConfig,
  getKagentChatPagePath,
  getSessionChatUrl,
  getSessionFromFrame,
  hasKagentChatRole,
  isKagentChatPage,
} from './kagent-chat';

const ORIGIN = 'https://skyline.example.com';
const base = { url: '/kagent', namespace: 'kagent', agent: 'k8s-agent' };
const config = (raw) => getKagentChatConfig(raw, ORIGIN);
const frameAt = (href) => {
  const { origin, pathname } = new URL(href);
  return { contentWindow: { location: { origin, pathname } } };
};

describe('getKagentChatConfig', () => {
  it('is disabled without configuration', () => {
    expect(config(null).status).toBe('disabled');
    expect(config({}).status).toBe('disabled');
  });

  it('reads the skyline-apiserver response (null for unset keys)', () => {
    const result = config({
      url: 'https://kagent.example.com/agents/kagent/chat-agent/chat',
      namespace: null,
      agent: null,
      ui_version: null,
      allowed_roles: ['admin'],
    });
    expect(result.status).toBe('ok');
    expect(result.uiVersion).toBe('v0');
    expect(result.allowedRoles).toEqual(['admin']);
  });

  it('builds the kagent v1 new-chat URL by default', () => {
    const result = config(base);
    expect(result.status).toBe('ok');
    expect(result.chatUrl).toBe(`${ORIGIN}/kagent/agents/kagent/k8s-agent/new`);
    expect(result.origin).toBe(ORIGIN);
  });

  it('builds the kagent v0 new-chat URL', () => {
    const result = config({ ...base, ui_version: 'v0' });
    expect(result.chatUrl).toBe(
      `${ORIGIN}/kagent/agents/kagent/k8s-agent/chat`
    );
  });

  it('accepts absolute http(s) URLs', () => {
    const result = config({ ...base, url: 'https://kagent.example.com/' });
    expect(result.chatUrl).toBe(
      'https://kagent.example.com/agents/kagent/k8s-agent/new'
    );
    expect(result.origin).toBe('https://kagent.example.com');
  });

  it.each([
    // eslint-disable-next-line no-script-url
    'javascript:alert(1)',
    '//evil.example.com',
    'data:text/html,x',
    'https://user:pass@kagent.example.com',
    'https://kagent.example.com/?token=x',
    'kagent',
  ])('rejects unsafe url %s', (url) => {
    expect(config({ ...base, url }).status).toBe('invalid');
  });

  it('rejects names that could alter the path', () => {
    expect(config({ ...base, agent: '../admin' }).status).toBe('invalid');
    expect(config({ ...base, namespace: 'a/b' }).status).toBe('invalid');
    expect(config({ ...base, agent: undefined }).status).toBe('invalid');
  });

  it('accepts a kagent chat link as url (v0 and v1)', () => {
    const v0 = config({
      url: 'https://kagent.example.com/agents/kagent/chat-agent/chat',
    });
    expect(v0.status).toBe('ok');
    expect(v0.chatUrl).toBe(
      'https://kagent.example.com/agents/kagent/chat-agent/chat'
    );
    expect([v0.namespace, v0.agent, v0.uiVersion]).toEqual([
      'kagent',
      'chat-agent',
      'v0',
    ]);
    expect(getSessionChatUrl(v0, 'abc')).toBe(
      'https://kagent.example.com/agents/kagent/chat-agent/chat/abc'
    );

    const v1 = config({ url: '/kagent/agents/kagent/k8s-agent/new/' });
    expect(v1.chatUrl).toBe(`${ORIGIN}/kagent/agents/kagent/k8s-agent/new`);
    expect(v1.uiVersion).toBe('v1');
    expect(getSessionChatUrl(v1, 'abc')).toBe(
      `${ORIGIN}/kagent/agents/abc/chat`
    );
  });

  it('rejects a chat link that contradicts other keys', () => {
    const url = 'https://kagent.example.com/agents/kagent/chat-agent/chat';
    expect(config({ url, agent: 'other' }).status).toBe('invalid');
    expect(config({ url, ui_version: 'v1' }).status).toBe('invalid');
    expect(config({ url, namespace: 'kagent', ui_version: 'v0' }).status).toBe(
      'ok'
    );
    expect(
      config({ url: 'https://kagent.example.com/agents/../x/chat' }).status
    ).toBe('invalid');
  });

  it('rejects unknown kagent UI versions', () => {
    expect(config({ ...base, ui_version: 'v2' }).status).toBe('invalid');
  });
});

describe('sessions', () => {
  it('opens an existing v1 conversation', () => {
    expect(getSessionChatUrl(config(base), 'abc-123')).toBe(
      `${ORIGIN}/kagent/agents/abc-123/chat`
    );
  });

  it('opens an existing v0 conversation', () => {
    const v0 = config({ ...base, ui_version: 'v0' });
    expect(getSessionChatUrl(v0, '42')).toBe(
      `${ORIGIN}/kagent/agents/kagent/k8s-agent/chat/42`
    );
  });

  it('ignores crafted session ids', () => {
    const c = config(base);
    ['../x', 'a/b', '', '%2e%2e', null].forEach((value) => {
      expect(getSessionChatUrl(c, value)).toBe(c.chatUrl);
    });
  });

  it('reads the conversation id from a same-origin frame', () => {
    const c = config(base);
    expect(
      getSessionFromFrame(frameAt(`${ORIGIN}/kagent/agents/abc-123/chat`), c)
    ).toBe('abc-123');
    expect(
      getSessionFromFrame(frameAt(`${ORIGIN}/kagent/agents/kagent/x/new`), c)
    ).toBeUndefined();
    expect(
      getSessionFromFrame(
        frameAt('https://other.example.com/kagent/agents/a/chat'),
        c
      )
    ).toBeUndefined();
  });

  it('falls back when the frame is cross-origin', () => {
    const frame = {
      get contentWindow() {
        throw new Error('SecurityError');
      },
    };
    expect(getSessionFromFrame(frame, config(base))).toBeUndefined();
  });

  it('builds Skyline page paths', () => {
    expect(getKagentChatPagePath()).toBe('/kagentchat/chat');
    expect(getKagentChatPagePath({ admin: true, session: 'a1' })).toBe(
      '/kagentchat/chat-admin?session=a1'
    );
    expect(getKagentChatPagePath({ session: '../x' })).toBe('/kagentchat/chat');
    expect(isKagentChatPage('/kagentchat/chat-admin')).toBe(true);
    expect(isKagentChatPage('/compute/instance')).toBe(false);
  });
});

describe('hasKagentChatRole', () => {
  it('allows everyone when no roles are configured', () => {
    expect(hasKagentChatRole(config(base), [])).toBe(true);
  });

  it('requires one of the configured roles', () => {
    const c = config({ ...base, allowed_roles: ['admin', 'ai-user'] });
    expect(hasKagentChatRole(c, [{ name: 'member' }])).toBe(false);
    expect(hasKagentChatRole(c, [{ name: 'ai-user' }])).toBe(true);
  });
});

describe('kagentchat feature flag', () => {
  it('is enabled unless the deployment sets it to false', () => {
    expect(isFeatureEnabled({}, 'kagentchat')).toBe(true);
    expect(isFeatureEnabled({ kagentchat: false }, 'kagentchat')).toBe(false);
  });

  it('gates both project and admin chat routes', () => {
    const off = { kagentchat: false };
    expect(isPathEnabled(off, '/kagentchat/chat')).toBe(false);
    expect(isPathEnabled(off, '/kagentchat/chat-admin')).toBe(false);
    expect(isPathEnabled({}, '/kagentchat/chat')).toBe(true);
    expect(isPathEnabled(off, '/compute/instance')).toBe(true);
  });
});
