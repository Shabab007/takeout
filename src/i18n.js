import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Cache from 'i18next-localstorage-cache';

import Languages from './constants/languages';
import LanguageNamespaces from './constants/language-namespaces';

// translation modules
import common_en from './assets/translations/en/common.json';
import static_en from './assets/translations/en/help-static.json';
import scan_en from './assets/translations/en/scan-table.json';
import order_en from './assets/translations/en/order.json';
import menu_en from './assets/translations/en/menu.json';

import common_jp from './assets/translations/jp/common.json';
import static_jp from './assets/translations/jp/help-static.json';
import scan_jp from './assets/translations/jp/scan-table.json';
import order_jp from './assets/translations/jp/order.json';
import menu_jp from './assets/translations/jp/menu.json';

import common_chi from './assets/translations/chi/common.json';
import static_chi from './assets/translations/chi/help-static.json';
import scan_chi from './assets/translations/chi/scan-table.json';
import order_chi from './assets/translations/chi/order.json';
import menu_chi from './assets/translations/chi/menu.json';

import common_ko from './assets/translations/ko/common.json';
import static_ko from './assets/translations/ko/help-static.json';
import scan_ko from './assets/translations/ko/scan-table.json';
import order_ko from './assets/translations/ko/order.json';
import menu_ko from './assets/translations/ko/menu.json';
import { getLanguageCodeFromLocalStorage } from './actions/nxt-local-storage';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  // .use(LanguageDetector)
  // .use(Cache)
  .init({
    resources: {
      // format:: lang_name: {namespace: json_file, another_namespace: another_file}
      [Languages.Japanese]: {
        [LanguageNamespaces.Common]: common_jp,
        [LanguageNamespaces.static]: static_jp,
        [LanguageNamespaces.scan]: scan_jp,
        [LanguageNamespaces.orderr]: order_jp,
        [LanguageNamespaces.menus]: menu_jp,
      },

      [Languages.English]: {
        [LanguageNamespaces.Common]: common_en, // 'common' is our custom namespace. we might add other namespaces if needed
        [LanguageNamespaces.static]: static_en,
        [LanguageNamespaces.scan]: scan_en,
        [LanguageNamespaces.orderr]: order_en,
        [LanguageNamespaces.menus]: menu_en,
      },

      [Languages.Chinese]: {
        [LanguageNamespaces.Common]: common_chi,
        [LanguageNamespaces.static]: static_chi,
        [LanguageNamespaces.scan]: scan_chi,
        [LanguageNamespaces.orderr]: order_chi,
        [LanguageNamespaces.menus]: menu_chi,
      },
      [Languages.Korean]: {
        [LanguageNamespaces.Common]: common_ko,
        [LanguageNamespaces.static]: static_ko,
        [LanguageNamespaces.scan]: scan_ko,
        [LanguageNamespaces.orderr]: order_ko,
        [LanguageNamespaces.menus]: menu_ko,
      },
    },
    lng: getLanguageCodeFromLocalStorage() || Languages.Japanese,
    fallbackLng: Languages.English,
    whitelist: [Languages.English, Languages.Japanese, Languages.Chinese, Languages.Korean],
    defaultNS: LanguageNamespaces.Common, // default namespace

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

// Usage:
// Define key, value pairs in namespace files. Notice, it supports interpolation and
// other formatting. please take a look at i18next official documentation for more info.
// {
//   "welcome": "Welcome {{userName}}"
// }

// import function with hook:
// const { t, i18n } = useTranslation();
// now translate
// t('welcome', { userName: 'Asif' })
