import React from 'react';
import { RobotOutlined } from '@ant-design/icons';
import globalRootStore from 'stores/root';
import {
  getKagentChatConfig,
  hasKagentChatRole,
  KAGENT_CHAT_PAGE_PATH,
} from 'utils/kagent-chat';

// The `kagentchat` feature flag is applied later by filterFeatureMenu (path
// based). This only hides the entry when the build has no kagent config or
// the user's roles are not in kagentChat.allowedRoles.
export const isKagentChatAvailable = () => {
  const config = getKagentChatConfig();
  return (
    config.status !== 'disabled' &&
    hasKagentChatRole(config, globalRootStore.roles)
  );
};

const renderKagentChatMenu = (t, { admin = false, ...extra } = {}) => {
  if (!isKagentChatAvailable()) return [];
  return [
    {
      path: `${KAGENT_CHAT_PAGE_PATH}${admin ? '-admin' : ''}`,
      name: t('AI Assistant'),
      key: admin ? 'kagentChatAdmin' : 'kagentChat',
      icon: <RobotOutlined />,
      level: 0,
      hasBreadcrumb: false,
      hasChildren: false,
      ...extra,
    },
  ];
};

export default renderKagentChatMenu;
