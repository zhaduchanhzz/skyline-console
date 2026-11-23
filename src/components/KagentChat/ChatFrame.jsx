import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

// kagent pages can stay blank if the UI is down or refuses framing
// (X-Frame-Options / CSP frame-ancestors). Browsers do not report either
// case to the parent, so a timeout is the only portable signal.
const LOAD_TIMEOUT = 20000;

// No allow-top-navigation: the embedded app must never navigate Skyline.
const SANDBOX = [
  'allow-scripts',
  'allow-same-origin',
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-downloads',
].join(' ');

const ChatFrame = forwardRef(({ src, title, className }, ref) => {
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), LOAD_TIMEOUT);
    return () => clearTimeout(timer);
  }, [src, attempt]);

  const onLoad = () => {
    setLoading(false);
    setSlow(false);
  };

  return (
    <div className={classnames(styles.frame, className)}>
      <iframe
        key={attempt}
        ref={ref}
        src={src}
        title={title}
        className={styles.iframe}
        sandbox={SANDBOX}
        allow="clipboard-write"
        referrerPolicy="same-origin"
        onLoad={onLoad}
      />
      {loading && !slow && (
        <div className={styles.overlay}>
          <Spin tip={t('Loading')} />
        </div>
      )}
      {loading && slow && (
        <div className={styles.overlay}>
          <Result
            status="warning"
            title={t('The AI Assistant is taking too long to respond.')}
            subTitle={t(
              'The kagent service may be unavailable or may not allow embedding. Retry, or contact your administrator if the problem continues.'
            )}
            extra={
              <Button type="primary" onClick={() => setAttempt(attempt + 1)}>
                {t('Retry')}
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
});

export default ChatFrame;
