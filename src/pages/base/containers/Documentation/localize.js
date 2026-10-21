import React from 'react';
import translations from './translations.json';

// Keys are normalized English text from Onboarding.jsx and Articles.jsx.
// Add matching entries for both locales when changing documentation prose.
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

const technicalTerms = {
  'security groups': 'Security Groups',
  'security group': 'Security Group',
  'floating ips': 'Floating IPs',
  'floating ip': 'Floating IP',
  'load balancers': 'Load Balancers',
  'load balancer': 'Load Balancer',
  'object storage': 'Object Storage',
  'block storage': 'Block Storage',
  cloud: 'Cloud',
  kubernetes: 'Kubernetes',
  vm: 'VM',
  api: 'API',
  openstack: 'OpenStack',
  flavor: 'Flavor',
  flavors: 'Flavors',
  image: 'Image',
  images: 'Images',
  volume: 'Volume',
  volumes: 'Volumes',
  network: 'Network',
  networks: 'Networks',
  instance: 'Instance',
  instances: 'Instances',
  project: 'Project',
  projects: 'Projects',
  region: 'Region',
  regions: 'Regions',
  server: 'Server',
  servers: 'Servers',
  subnet: 'Subnet',
  subnets: 'Subnets',
  router: 'Router',
  routers: 'Routers',
  quota: 'Quota',
  quotas: 'Quotas',
  snapshot: 'Snapshot',
  snapshots: 'Snapshots',
  container: 'Container',
  containers: 'Containers',
  metric: 'Metric',
  metrics: 'Metrics',
  metadata: 'Metadata',
  gateway: 'Gateway',
  port: 'Port',
  ports: 'Ports',
};
const technicalTermPattern = new RegExp(
  `(^|[^A-Za-z0-9_-])(${Object.keys(technicalTerms).join(
    '|'
  )})(?=$|[^A-Za-z0-9_-])`,
  'gi'
);

function preserveTechnicalTerms(value) {
  return value.replace(
    technicalTermPattern,
    (match, prefix, term) => `${prefix}${technicalTerms[term.toLowerCase()]}`
  );
}

export function localizeText(value, locale) {
  const dictionary = translations[locale];
  if (!dictionary || typeof value !== 'string') {
    return value;
  }
  const translated = dictionary[normalize(value)];
  if (!translated) {
    return value;
  }
  const leadingSpace = /^\s/.test(value) ? ' ' : '';
  const trailingSpace = /\s$/.test(value) ? ' ' : '';
  return `${leadingSpace}${preserveTechnicalTerms(translated)}${trailingSpace}`;
}

export function localizeNode(node, locale) {
  if (typeof node === 'string') {
    return localizeText(node, locale);
  }
  if (Array.isArray(node)) {
    return node.map((child) => localizeNode(child, locale));
  }
  if (!React.isValidElement(node)) {
    return node;
  }
  if (
    node.type === 'code' ||
    node.type === 'pre' ||
    node.type.name === 'CodeBlock'
  ) {
    return node;
  }
  if (!node.props.children) {
    return node;
  }
  return React.cloneElement(
    node,
    undefined,
    ...React.Children.toArray(node.props.children).map((child) =>
      localizeNode(child, locale)
    )
  );
}
