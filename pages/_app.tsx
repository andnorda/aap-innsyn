import '@navikt/ds-css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { initAmplitude } from '../utils/amplitude';
import messagesNb from '../translations/nb.json';
import messagesNn from '../translations/nn.json';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { Locale, onLanguageSelect, setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler';
import { SUPPORTED_LOCALE } from '../translations/locales';

function flattenMessages(nestedMessages: object, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    // @ts-ignore
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // @ts-ignore
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

const getLocaleOrFallback = (locale?: string) => {
  console.log('locale', locale);
  if (locale && SUPPORTED_LOCALE.includes(locale)) {
    return locale;
  }

  return 'nb';
};

type Messages = {
  [K in Locale]?: { [name: string]: string };
};

export const messages: Messages = {
  nb: flattenMessages(messagesNb),
  nn: flattenMessages(messagesNn),
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getLocaleOrFallback(router.locale);
  const { pathname, asPath, query } = router;

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    setAvailableLanguages([
      {
        locale: 'nb',
        handleInApp: true,
      },
      {
        locale: 'nn',
        handleInApp: true,
      },
    ]);
  });

  onLanguageSelect((language) => {
    router.push({ pathname, query }, asPath, { locale: language.locale });
  });

  return (
    <>
      {/* @ts-ignore */}
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Component {...pageProps} />
      </IntlProvider>
    </>
  );
}

export default MyApp;
