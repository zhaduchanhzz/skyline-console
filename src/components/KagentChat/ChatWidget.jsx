import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Tooltip } from 'antd';
import {
  CloseOutlined,
  ExpandOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import featureStore from 'stores/skyline/features';
import { isAdminPage } from 'utils/index';
import {
  getKagentChatConfig,
  getSessionFromFrame,
  getKagentChatPagePath,
  hasKagentChatRole,
  isKagentChatPage,
  KAGENT_CHAT_FEATURE,
} from 'utils/kagent-chat';
import ChatFrame from './ChatFrame';
import ChatStatus from './ChatStatus';
import styles from './index.less';

// Mounted once by the Base layout, so it survives route changes.
export class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.frameRef = createRef();
    // `started`: the iframe is created on first open and then kept mounted
    // (hidden while closed) so closing the panel never restarts the chat.
    this.state = { open: false, started: false };
  }

  // From skyline.yaml via GET /features; loaded before the layout renders.
  get config() {
    return getKagentChatConfig(featureStore.kagentChat);
  }

  get visible() {
    const { rootStore } = this.props;
    const { config } = this;
    return (
      config.status !== 'disabled' &&
      featureStore.isEnabled(KAGENT_CHAT_FEATURE) &&
      hasKagentChatRole(config, rootStore.roles) &&
      !!rootStore.user
    );
  }

  show = () => this.setState({ open: true, started: true });

  close = () => this.setState({ open: false });

  expand = () => {
    const { rootStore, location } = this.props;
    const session = getSessionFromFrame(this.frameRef.current, this.config);
    this.close();
    rootStore.routing.push(
      getKagentChatPagePath({ admin: isAdminPage(location.pathname), session })
    );
  };

  renderTrigger() {
    return (
      <Tooltip title={t('AI Assistant')} placement="left">
        <Button
          type="primary"
          shape="circle"
          className={styles.trigger}
          icon={<RobotOutlined />}
          aria-label={t('Open AI Assistant')}
          onClick={this.show}
        />
      </Tooltip>
    );
  }

  renderPanel(hidden) {
    const { config } = this;
    return (
      <div
        className={classnames(styles.panel, hidden && styles['panel-hidden'])}
        role="dialog"
        aria-label={t('AI Assistant')}
      >
        <div className={styles['panel-header']}>
          <span className={styles['panel-title']}>
            <RobotOutlined />
            {t('AI Assistant')}
          </span>
          <span>
            {config.status === 'ok' && (
              <Tooltip title={t('Open in full page')}>
                <Button
                  type="text"
                  icon={<ExpandOutlined />}
                  aria-label={t('Open in full page')}
                  onClick={this.expand}
                />
              </Tooltip>
            )}
            <Tooltip title={t('Close')}>
              <Button
                type="text"
                icon={<CloseOutlined />}
                aria-label={t('Close')}
                onClick={this.close}
              />
            </Tooltip>
          </span>
        </div>
        <div className={styles['panel-body']}>
          {config.status === 'ok' ? (
            <ChatFrame
              ref={this.frameRef}
              src={config.chatUrl}
              title={t('AI Assistant')}
            />
          ) : (
            <ChatStatus config={config} />
          )}
        </div>
      </div>
    );
  }

  render() {
    if (!this.visible) return null;
    const { open, started } = this.state;
    // Never shown on the full chat page itself.
    const onPage = isKagentChatPage(this.props.location.pathname);
    return (
      <>
        {!open && !onPage && this.renderTrigger()}
        {started && this.renderPanel(!open || onPage)}
      </>
    );
  }
}

export default inject('rootStore')(observer(ChatWidget));
