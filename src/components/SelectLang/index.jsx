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

import { Menu, Dropdown } from 'antd';
import i18n from 'core/i18n';
import React, { useState } from 'react';
import classNames from 'classnames';
import { CheckOutlined, DownOutlined, GlobalOutlined } from '@ant-design/icons';
import styles from './index.less';

const { getLocale, setLocale, SUPPORT_LOCALES } = i18n;

const SelectLang = (props) => {
  const [visible, setVisible] = useState(false);
  if (SUPPORT_LOCALES.length <= 1) {
    return null;
  }

  const { className, navbar = false } = props;
  const selectedLang = getLocale();
  const selectedLocale =
    SUPPORT_LOCALES.find((it) => it.value === selectedLang) ||
    SUPPORT_LOCALES[0];

  const changeLang = ({ key }) => {
    setVisible(false);
    setLocale(key, false);
  };

  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[selectedLocale.value]}
      onClick={changeLang}
    >
      {SUPPORT_LOCALES.map((locale) => (
        <Menu.Item key={locale.value}>
          <span className={styles['menu-label']}>{locale.name}</span>
          {locale.value === selectedLocale.value && (
            <CheckOutlined className={styles['menu-check']} />
          )}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown
      overlay={langMenu}
      placement="bottomRight"
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      <button
        type="button"
        className={classNames(styles['drop-down'], className)}
        aria-label={`${t('Switch Language')}: ${selectedLocale.name}`}
        aria-haspopup="menu"
        aria-expanded={visible}
        title={`${t('Switch Language')}: ${selectedLocale.name}`}
      >
        <GlobalOutlined className={navbar ? styles['navbar-globe'] : ''} />
        {navbar && (
          <>
            <span className={styles['language-name']}>
              {selectedLocale.name}
            </span>
            <span className={styles['language-code']}>
              {selectedLocale.icon.toUpperCase()}
            </span>
            <DownOutlined className={styles['navbar-caret']} />
          </>
        )}
      </button>
    </Dropdown>
  );
};

export default SelectLang;
