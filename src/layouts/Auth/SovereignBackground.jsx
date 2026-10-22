import React, { Component } from 'react';
import sovereignCloudImage from 'asset/image/sovereign-cloud-balanced.png';
import styles from './index.less';

const MODULES = [
  {
    id: 'network',
    label: 'Networking',
    ariaLabel: () => t('Networking and API gateway'),
    iconCenter: [648, 421],
    iconPath:
      'M 647 389 C 666 389 680 405 680 422 C 680 440 666 454 648 454 C 630 454 616 441 616 422 C 616 405 629 389 647 389 Z',
    labelPosition: [810, 455],
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    ariaLabel: () => t('Kubernetes and containers'),
    iconCenter: [798, 186],
    iconPath:
      'M 786 155 L 813 160 L 829 184 L 822 208 L 798 216 L 771 204 L 765 179 Z',
    labelPosition: [779, 107],
  },
  {
    id: 'vm',
    label: 'VM',
    ariaLabel: () => t('VM and compute'),
    iconCenter: [1396, 178],
    iconPath:
      'M 1388 116 L 1438 136 L 1439 210 L 1429 225 L 1395 242 L 1350 222 L 1350 165 L 1360 156 L 1360 136 Z',
    labelPosition: [1390, 305],
  },
  {
    id: 'storage',
    label: 'Storage',
    ariaLabel: () => t('Database and storage'),
    iconCenter: [1542, 406],
    iconPath:
      'M 1526 355 C 1553 352 1562 367 1562 385 L 1562 409 L 1588 413 L 1589 449 L 1562 463 L 1524 451 C 1512 446 1500 439 1500 426 L 1500 378 C 1500 365 1510 357 1526 355 Z',
    labelPosition: [1515, 315],
  },
  {
    id: 'security',
    label: 'Security',
    ariaLabel: () => t('Security and firewall'),
    iconCenter: [1447, 639],
    iconPath:
      'M 1445 590 C 1464 601 1478 600 1490 606 L 1487 647 C 1483 667 1464 681 1447 688 C 1421 676 1409 658 1406 636 L 1406 606 C 1423 606 1434 600 1445 590 Z',
    labelPosition: [1396, 545],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    ariaLabel: () => t('Monitoring and analytics'),
    iconCenter: [958, 688],
    iconPath: 'M 901 632 L 974 650 L 1019 668 L 1024 722 L 972 751 L 899 720 Z',
    labelPosition: [936, 600],
  },
];

export default class SovereignBackground extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTarget: null, pinnedTarget: null, compact: false };
  }

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  updateViewport = () => {
    const compact =
      window.innerWidth <= 900 && window.innerHeight > window.innerWidth;
    if (compact !== this.state.compact) {
      this.setState({ compact });
    }
  };

  activate = (id) => this.setState({ activeTarget: id });

  restorePinned = () =>
    this.setState(({ pinnedTarget }) => ({ activeTarget: pinnedTarget }));

  togglePinned = (id) =>
    this.setState(({ pinnedTarget }) => {
      const next = pinnedTarget === id ? null : id;
      return { pinnedTarget: next, activeTarget: next };
    });

  handleKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.togglePinned(id);
    } else if (event.key === 'Escape') {
      this.setState({ activeTarget: null, pinnedTarget: null });
      event.currentTarget.blur();
    }
  };

  clearPinnedOnBackground = (event) => {
    if (!event.target.closest('[data-scene-target]')) {
      this.setState({ activeTarget: null, pinnedTarget: null });
    }
  };

  renderModule = (module) => {
    const { activeTarget, pinnedTarget } = this.state;
    const isActive = activeTarget === module.id;
    const [labelX, labelY] = module.labelPosition;

    return (
      <g
        key={module.id}
        className={`${styles.module} ${isActive ? styles.active : ''}`}
        data-scene-target={module.id}
        role="button"
        tabIndex="0"
        aria-label={module.ariaLabel()}
        aria-pressed={pinnedTarget === module.id}
        onPointerEnter={() => this.activate(module.id)}
        onPointerLeave={this.restorePinned}
        onFocus={() => this.activate(module.id)}
        onBlur={this.restorePinned}
        onClick={() => this.togglePinned(module.id)}
        onKeyDown={(event) => this.handleKeyDown(event, module.id)}
      >
        <g
          className={styles.moduleLabel}
          transform={`translate(${labelX} ${labelY})`}
        >
          <text>{module.label}</text>
        </g>
        <path className={styles.moduleHit} d={module.iconPath} />
      </g>
    );
  };

  render() {
    const { activeTarget, pinnedTarget, compact } = this.state;
    const activeModule = MODULES.find((module) => module.id === activeTarget);

    return (
      <div className={styles.background}>
        <svg
          className={styles.cloudMap}
          viewBox={compact ? '640 0 1020 921' : '0 0 1708 921'}
          preserveAspectRatio={compact ? 'xMidYMid slice' : 'xMidYMid meet'}
          role="group"
          aria-label={t('Interactive Sovereign Cloud infrastructure')}
          onPointerDown={this.clearPinnedOnBackground}
        >
          <defs>
            <filter
              id="sovereignArtworkFeather"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <mask
              id="sovereignSceneMask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1708"
              height="921"
            >
              <rect width="1708" height="921" fill="white" />
              {activeModule && (
                <path
                  d={activeModule.iconPath}
                  fill="black"
                  filter="url(#sovereignArtworkFeather)"
                />
              )}
            </mask>
            <mask
              id="sovereignActiveArtworkMask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1708"
              height="921"
            >
              {activeModule && (
                <path
                  d={activeModule.iconPath}
                  fill="white"
                  filter="url(#sovereignArtworkFeather)"
                />
              )}
            </mask>
            <filter
              id="sovereignCloudGlow"
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <image
            className={styles.illustration}
            xlinkHref={sovereignCloudImage}
            mask="url(#sovereignSceneMask)"
            x="0"
            y="0"
            width="1708"
            height="921"
            preserveAspectRatio="none"
          />
          {activeModule && (
            <g
              key={activeModule.id}
              className={styles.moduleArtwork}
              style={{
                transformOrigin: `${activeModule.iconCenter[0]}px ${activeModule.iconCenter[1]}px`,
              }}
              aria-hidden="true"
            >
              <image
                xlinkHref={sovereignCloudImage}
                x="0"
                y="0"
                width="1708"
                height="921"
                mask="url(#sovereignActiveArtworkMask)"
                preserveAspectRatio="none"
              />
            </g>
          )}
          <ellipse
            className={`${styles.cloudLight} ${
              activeTarget === 'cloud' ? styles.active : ''
            }`}
            cx="1055"
            cy="418"
            rx="145"
            ry="84"
          />
          {MODULES.map(this.renderModule)}
          <g
            className={`${styles.cloudTarget} ${
              activeTarget === 'cloud' ? styles.active : ''
            }`}
            data-scene-target="cloud"
            role="button"
            tabIndex="0"
            aria-label="Sovereign Cloud"
            aria-pressed={pinnedTarget === 'cloud'}
            onPointerEnter={() => this.activate('cloud')}
            onPointerLeave={this.restorePinned}
            onFocus={() => this.activate('cloud')}
            onBlur={this.restorePinned}
            onClick={() => this.togglePinned('cloud')}
            onKeyDown={(event) => this.handleKeyDown(event, 'cloud')}
          >
            <g className={styles.cloudLabel} transform="translate(1055 227)">
              <text>Sovereign Cloud</text>
            </g>
            <rect
              className={styles.cloudHit}
              x="891"
              y="238"
              width="362"
              height="245"
              rx="24"
            />
          </g>
        </svg>
      </div>
    );
  }
}
