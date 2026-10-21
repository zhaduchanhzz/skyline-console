// Local development API for running the console without an OpenStack cloud.
// This middleware is installed only by the API=local webpack configuration.
const { randomBytes } = require('crypto');

const API_PREFIX = '/api/openstack/skyline/api/v1';
const SESSION_COOKIE = 'skyline_local_session';
const SESSION_SECONDS = 12 * 60 * 60;
const PROJECT_ID = 'local-project';
const USER_ID = 'local-admin';
const DOMAIN = { id: 'default', name: 'Default' };

const emptyQuota = (names) =>
  Object.fromEntries(
    names.map((name) => [name, { in_use: 0, reserved: 0, limit: 10 }])
  );

const NOVA_QUOTA = emptyQuota([
  'instances',
  'cores',
  'ram',
  'key_pairs',
  'server_groups',
]);
const NEUTRON_QUOTA = emptyQuota([
  'network',
  'router',
  'subnet',
  'floatingip',
  'port',
  'security_group',
  'security_group_rule',
]);
const CINDER_QUOTA = emptyQuota([
  'volumes',
  'gigabytes',
  'snapshots',
  'backups',
  'backup_gigabytes',
]);

const endpoints = {
  keystone: '/api/openstack/keystone',
  nova: '/api/openstack/nova',
  neutron: '/api/openstack/neutron',
  cinder: '/api/openstack/cinder',
  glance: '/api/openstack/glance',
  placement: '/api/openstack/placement',
};

const response = (res, status, data, extraHeaders = {}) => {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
    'X-Skyline-Local-Mock': 'true',
    ...extraHeaders,
  });
  res.end(payload);
};

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 64 * 1024) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (_error) {
        reject(new Error('Invalid JSON request body'));
      }
    });
    req.on('error', reject);
  });

const getCookie = (req, name) => {
  const cookies = String(req.headers.cookie || '').split(';');
  const found = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return found ? found.trim().slice(name.length + 1) : '';
};

const makeProfile = (token) => {
  const project = {
    id: PROJECT_ID,
    name: 'Local project',
    domain: DOMAIN,
    domain_id: DOMAIN.id,
  };
  const role = { id: 'local-admin-role', name: 'admin' };
  return {
    user: {
      id: USER_ID,
      name: 'admin',
      domain: DOMAIN,
      default_project_id: PROJECT_ID,
    },
    project,
    projects: { [PROJECT_ID]: { project, roles: [role] } },
    default_project_id: PROJECT_ID,
    roles: [role],
    base_domains: [DOMAIN],
    region: 'RegionOne',
    endpoints,
    keystone_token: token,
    version: 'standalone-local',
  };
};

const readService = (path) => {
  if (/^\/api\/openstack\/keystone\/v3\/projects\/[^/]+\/tags$/.test(path)) {
    return { tags: [] };
  }
  if (
    /^\/api\/openstack\/keystone\/v3\/system\/users\/[^/]+\/roles$/.test(path)
  ) {
    return { roles: [{ id: 'local-admin-role', name: 'admin' }] };
  }
  if (
    /^\/api\/openstack\/nova\/v2\.1\/os-quota-sets\/[^/]+\/detail$/.test(path)
  ) {
    return { quota_set: { id: PROJECT_ID, ...NOVA_QUOTA } };
  }
  if (/^\/api\/openstack\/neutron\/v2\.0\/quotas\/[^/]+\/details$/.test(path)) {
    return { quota: NEUTRON_QUOTA };
  }
  if (
    /^\/api\/openstack\/cinder\/v3\/[^/]+\/os-quota-sets\/[^/]+$/.test(path)
  ) {
    return { quota_set: { id: PROJECT_ID, ...CINDER_QUOTA } };
  }

  const collections = [
    ['keystone', 'projects', 'projects'],
    ['keystone', 'users', 'users'],
    ['keystone', 'domains', 'domains'],
    ['keystone', 'roles', 'roles'],
    ['nova', 'servers', 'servers'],
    ['nova', 'os-keypairs', 'keypairs'],
    ['nova', 'os-hypervisors', 'hypervisors'],
    ['nova', 'os-services', 'services'],
    ['nova', 'flavors', 'flavors'],
    ['neutron', 'extensions', 'extensions'],
    ['neutron', 'networks', 'networks'],
    ['neutron', 'subnets', 'subnets'],
    ['neutron', 'ports', 'ports'],
    ['neutron', 'routers', 'routers'],
    ['neutron', 'agents', 'agents'],
    ['neutron', 'security-groups', 'security_groups'],
    ['neutron', 'floatingips', 'floatingips'],
    ['cinder', 'types', 'volume_types'],
    ['cinder', 'volumes', 'volumes'],
    ['glance', 'images', 'images'],
    ['placement', 'resource_providers', 'resource_providers'],
  ];
  const collection = collections.find(
    ([service, route]) =>
      path.startsWith(`/api/openstack/${service}/`) &&
      (path.endsWith(`/${route}`) || path.endsWith(`/${route}/detail`))
  );
  return collection ? { [collection[2]]: [], count: 0 } : null;
};

const createStandaloneMock = () => {
  const sessions = new Map();

  return async (req, res, next) => {
    const path =
      new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
    if (!path.startsWith('/api/')) {
      next();
      return;
    }

    const method = req.method.toUpperCase();
    if (method === 'GET') {
      const publicReads = {
        [`${API_PREFIX}/contrib/regions`]: ['RegionOne'],
        [`${API_PREFIX}/contrib/domains`]: ['Default'],
        [`${API_PREFIX}/config`]: { default_domain: 'Default' },
        [`${API_PREFIX}/sso`]: { enable_sso: false, protocols: [] },
        [`${API_PREFIX}/message-banners/public`]: { message_banners: [] },
      };
      if (Object.prototype.hasOwnProperty.call(publicReads, path)) {
        response(res, 200, publicReads[path]);
        return;
      }
    }

    if (method === 'POST' && path === `${API_PREFIX}/login`) {
      let body;
      try {
        body = await readJson(req);
      } catch (error) {
        response(res, 400, { detail: error.message });
        return;
      }
      if (
        body.username !== 'admin' ||
        body.password !== 'admin' ||
        body.region !== 'RegionOne' ||
        (body.domain && body.domain !== 'Default')
      ) {
        response(res, 401, { detail: 'Invalid local username or password' });
        return;
      }
      const token = randomBytes(32).toString('hex');
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
      sessions.set(token, expiresAt);
      response(
        res,
        200,
        { keystone_token: token },
        {
          'Set-Cookie': [
            `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`,
            `time_expired=${expiresAt}; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`,
          ],
        }
      );
      return;
    }

    const token = getCookie(req, SESSION_COOKIE) || req.headers['x-auth-token'];
    const expiry = sessions.get(token);
    if (!expiry || expiry <= Math.floor(Date.now() / 1000)) {
      if (expiry) sessions.delete(token);
      response(res, 401, { detail: 'Local session expired; sign in again' });
      return;
    }

    if (method === 'POST' && path === `${API_PREFIX}/logout`) {
      sessions.delete(token);
      response(
        res,
        200,
        {},
        {
          'Set-Cookie': [
            `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
            'time_expired=; SameSite=Strict; Path=/; Max-Age=0',
          ],
        }
      );
      return;
    }

    if (method !== 'GET') {
      response(res, 501, {
        detail: 'This action requires a real OpenStack deployment',
      });
      return;
    }

    const skylineReads = {
      [`${API_PREFIX}/profile`]: makeProfile(token),
      // The UI treats an empty policy list as "no access". A single admin
      // policy keeps the local demo navigation visible.
      [`${API_PREFIX}/policies`]: {
        policies: [{ rule: 'admin', allowed: true }],
      },
      [`${API_PREFIX}/features`]: { features: {} },
      [`${API_PREFIX}/message-banners/active`]: { message_banners: [] },
      [`${API_PREFIX}/settings`]: { settings: [] },
      [`${API_PREFIX}/extension/servers`]: { servers: [], count: 0 },
      [`${API_PREFIX}/extension/volumes`]: { volumes: [], count: 0 },
    };
    const data = Object.prototype.hasOwnProperty.call(skylineReads, path)
      ? skylineReads[path]
      : readService(path);
    if (data !== null) {
      response(res, 200, data);
      return;
    }
    response(res, 404, { detail: `No local mock data for ${path}` });
  };
};

module.exports = { createStandaloneMock };
