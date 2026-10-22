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

import moment from 'moment';
import 'moment/locale/vi';
import { isArray } from 'lodash';
import cookie from 'utils/cookie';
import SLI18n from 'utils/translate';
import { setLocalStorageItem } from 'utils/local-storage';

import locales from '../locales';

const SUPPORT_LOCALES_ALL = [
  {
    name: 'Tiếng Việt',
    value: 'vi',
    shortName: 'vi',
    icon: 'vi',
    momentName: 'vi',
  },
  {
    name: 'English',
    value: 'en',
    shortName: 'en',
    icon: 'en',
    momentName: 'en',
  },
];

const getDefaultLanguageInConfig = () => {
  const { defaultLanguage } = GLOBAL_VARIABLES;
  return SUPPORT_LOCALES_ALL.some((it) => it.value === defaultLanguage)
    ? defaultLanguage
    : 'vi';
};

const getSupportLanguagesInConfig = () => {
  const { supportLanguages } = GLOBAL_VARIABLES;
  const defaultLang = getDefaultLanguageInConfig();
  const configured = isArray(supportLanguages)
    ? supportLanguages
    : ['vi', 'en'];
  return [...new Set([...configured, defaultLang])];
};

const supportedLanguages = getSupportLanguagesInConfig();
const SUPPORT_LOCALES = SUPPORT_LOCALES_ALL.filter((it) =>
  supportedLanguages.includes(it.value)
);

const isSupportedLocale = (locale) =>
  SUPPORT_LOCALES.some((it) => it.value === locale);

const getMomentName = (locale) => {
  const item = SUPPORT_LOCALES_ALL.find((it) => it.value === locale);
  return (item || {}).momentName || 'vi';
};

const intl = new SLI18n();

const setLocaleToStorage = (value) => {
  setLocalStorageItem('lang', value);
};

const getLocale = () => {
  // Ignore saved languages that are no longer supported.
  const storedLocale = intl.getLocaleFromLocalStorage({
    localStorageLocaleKey: 'lang',
  });
  const urlLocale = intl.getLocaleFromURL({ urlLocaleKey: 'lang' });
  const cookieLocale = intl.getLocaleFromCookie({ cookieLocaleKey: 'lang' });
  const currentLocale =
    [storedLocale, urlLocale, cookieLocale].find(isSupportedLocale) ||
    getDefaultLanguageInConfig();

  if (storedLocale && !isSupportedLocale(storedLocale)) {
    setLocaleToStorage(currentLocale);
  }

  moment.locale(getMomentName(currentLocale));
  document.documentElement.lang = currentLocale;
  return currentLocale;
};

const getLocaleShortName = () => {
  const fullName = getLocale();
  const item = SUPPORT_LOCALES.find((it) => it.value === fullName);
  return item ? item.shortName : fullName;
};

const loadLocales = () => {
  const currentLocale = getLocale();
  return intl.init({
    currentLocale,
    locales,
    fallbackLocale: 'en',
  });
};

const setLocale = (lang) => {
  const selectedLocale = isSupportedLocale(lang)
    ? lang
    : getDefaultLanguageInConfig();
  setLocaleToStorage(selectedLocale);
  cookie('lang', selectedLocale);
  moment.locale(getMomentName(selectedLocale));
  window.location.reload();
  return selectedLocale;
};

const init = () => {
  moment.locale(getMomentName(getLocale()));
  return { locales };
};

const t = (key, options) => intl.get(key, options);

t.html = (key, options) => intl.getHTML(key, options);

loadLocales();
init();
window.t = t;

export default {
  getLocale,
  setLocale,
  loadLocales,
  init,
  t,
  getLocaleShortName,
  SUPPORT_LOCALES,
};
