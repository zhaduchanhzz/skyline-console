import React from 'react';
import { Result } from 'antd';

// Shared message for configurations that cannot render a chat frame.
const ChatStatus = ({ config, allowed = true }) => {
  if (!allowed) {
    return (
      <Result
        status="403"
        title={t('You do not have permission to use the AI Assistant.')}
        subTitle={t('Contact your administrator to request access.')}
      />
    );
  }
  if (config.status === 'disabled') {
    return (
      <Result
        status="info"
        title={t('The AI Assistant is not configured.')}
        subTitle={t(
          'Ask your administrator to set kagent_chat in skyline.yaml.'
        )}
      />
    );
  }
  if (config.status === 'invalid') {
    return (
      <Result
        status="error"
        title={t('The AI Assistant configuration is invalid.')}
        subTitle={config.error}
      />
    );
  }
  return null;
};

export default ChatStatus;
