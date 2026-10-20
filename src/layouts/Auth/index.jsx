// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Tag } from 'antd';
import { BellOutlined, ToolOutlined } from '@ant-design/icons';
import renderRoutes from 'utils/RouterConfig';
import globalMessageBannerStore from 'stores/skyline/message-banner';
import {
  getMessageTypeLabel,
  formatUtcTime,
} from 'resources/skyline/message-banner';

import SovereignBackground from './SovereignBackground';
import styles from './index.less';

export class AuthLayout extends Component {
  constructor(props) {
    super(props);
    this.routes = props.route.routes;
    this.state = { currentSlide: 0 };
  }

  componentDidMount() {
    globalMessageBannerStore.fetchPublic().catch(() => {});
    this.autoSlideTimer = setInterval(() => {
      if (this.paused) return;
      const banners = globalMessageBannerStore.publicBanners || [];
      if (banners.length > 1) {
        this.setState((prevState) => ({
          currentSlide: ((prevState.currentSlide || 0) + 1) % banners.length,
        }));
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.autoSlideTimer);
  }

  renderPublicBanners() {
    const banners = globalMessageBannerStore.publicBanners || [];
    if (!banners.length) {
      return null;
    }
    const currentSlide = this.state.currentSlide || 0;
    const banner = banners[currentSlide];
    return (
      <div className={styles.publicBanners}>
        <div
          className={styles.publicBannerCard}
          onMouseEnter={() => {
            this.paused = true;
          }}
          onMouseLeave={() => {
            this.paused = false;
          }}
        >
          <div className={styles.publicBannerContent}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 3,
              }}
            >
              {banner.type === 'maintenance' ? (
                <ToolOutlined style={{ fontSize: 12, color: '#666' }} />
              ) : (
                <BellOutlined style={{ fontSize: 12, color: '#666' }} />
              )}
              <Tag
                color={banner.type === 'maintenance' ? 'blue' : 'orange'}
                style={{ fontSize: 10, margin: 0 }}
              >
                {getMessageTypeLabel(banner.type)}
              </Tag>
            </div>
            <div className={styles.publicBannerItemTitle}>
              {banner.title || '-'}
            </div>
            <div className={styles.publicBannerMessage}>{banner.message}</div>
            {banner.expires_at && (
              <div className={styles.publicBannerMeta}>
                {banner.type === 'maintenance' ? (
                  <>
                    <strong>{t('Start')}:</strong>{' '}
                    {banner.start_at ? formatUtcTime(banner.start_at) : '-'}
                    {' | '}
                    <strong>{t('End')}:</strong>{' '}
                    {formatUtcTime(banner.expires_at)}
                  </>
                ) : (
                  <>
                    <strong>{t('End')}:</strong>{' '}
                    {formatUtcTime(banner.expires_at)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={styles.container}
        role="main"
        aria-label="Authentication page"
      >
        <section
          className={styles.visualPanel}
          aria-label="Sovereign Next cloud illustration"
        >
          <SovereignBackground />
          <div
            className={styles.brandingContainer}
            role="banner"
            aria-labelledby="brand-title"
          >
            <h2
              id="brand-title"
              className={styles.brandTitle}
              aria-label="Sovereign Next"
            >
              Sovereign Next
            </h2>
          </div>
        </section>

        <section className={styles.formPanel} aria-label="Login form section">
          {this.renderPublicBanners()}
          <div
            className={styles.cardContainer}
            role="form"
            aria-label="User authentication form"
          >
            {renderRoutes(this.routes)}
          </div>
        </section>
      </div>
    );
  }
}

export default inject('rootStore')(observer(AuthLayout));
