import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import featureStore from 'stores/skyline/features';
import ChatFrame from 'components/KagentChat/ChatFrame';
import ChatStatus from 'components/KagentChat/ChatStatus';
import styles from 'components/KagentChat/index.less';
import {
  getKagentChatConfig,
  getSessionChatUrl,
  hasKagentChatRole,
} from 'utils/kagent-chat';

// Route access for the `kagentchat` feature flag is enforced by the Base
// layout (Right.jsx) through features.json, like every other panel.
export class Chat extends Component {
  get config() {
    return getKagentChatConfig(featureStore.kagentChat);
  }

  get src() {
    const session = new URLSearchParams(this.props.location.search).get(
      'session'
    );
    return getSessionChatUrl(this.config, session);
  }

  render() {
    const { config } = this;
    const allowed = hasKagentChatRole(config, this.props.rootStore.roles);
    if (!allowed || config.status !== 'ok') {
      return <ChatStatus config={config} allowed={allowed} />;
    }
    // src only changes with ?session=, so in-frame navigation by kagent
    // (new conversation id after the first message) never reloads it.
    return (
      <div className={styles.page}>
        <ChatFrame src={this.src} title={t('AI Assistant')} />
      </div>
    );
  }
}

export default inject('rootStore')(observer(Chat));
