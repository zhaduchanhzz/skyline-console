import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import i18n from 'core/i18n';
import { FlavorArticle, ImageArticle } from './Articles';
import { onboardingTopics } from './Onboarding';
import { localizeNode, localizeText } from './localize';
import { getDocsRoot, topicPath } from './paths';
import styles from './style.less';

const referenceTopics = [
  {
    slug: 'flavors',
    title: 'Compute flavors',
    summary:
      'Understand instance sizes, resource allocation, extra specs, and how to select or create a flavor.',
    content: <FlavorArticle />,
  },
  {
    slug: 'images',
    title: 'Images and Glance',
    summary:
      'Prepare, upload, verify, and use operating system images with compatible image properties.',
    content: <ImageArticle />,
  },
];

const introductionSlugs = ['welcome', 'install-cli', 'getting-started'];
const introductionTopics = onboardingTopics.filter((topic) =>
  introductionSlugs.includes(topic.slug)
);
const cloudTopics = onboardingTopics.filter(
  (topic) => !introductionSlugs.includes(topic.slug)
);
const sections = [
  { title: 'Start here', topics: introductionTopics },
  { title: 'Cloud onboarding', topics: cloudTopics },
  { title: 'Technical guides', topics: referenceTopics },
];
const copy = {
  en: {
    start: 'Start here',
    onboarding: 'Cloud onboarding',
    technical: 'Technical guides',
    helpCenter: 'Help center',
    documentation: 'Documentation',
    tagline: 'Everything you need to build and operate your private cloud.',
    find: 'Find a guide',
    topics: 'Documentation topics',
    overview: 'Overview',
    noMatches: 'No matching guides.',
    explore: 'Explore the platform',
    getStarted: 'Get started with your cloud',
    intro:
      'Follow the onboarding guides, then use the reference guides when choosing resources for an instance.',
    missing: 'Guide not found',
    missingDetails: 'The requested documentation page is not available.',
    browse: 'Browse documentation',
    more: 'More guides',
    previous: 'Previous',
    next: 'Next',
    onPage: 'On this page',
    read: 'Read guide',
  },
  vi: {
    start: 'Bắt đầu',
    onboarding: 'Hướng dẫn Cloud',
    technical: 'Hướng dẫn kỹ thuật',
    helpCenter: 'Trung tâm trợ giúp',
    documentation: 'Tài liệu',
    tagline: 'Tài liệu để xây dựng và vận hành Private Cloud của bạn.',
    find: 'Tìm hướng dẫn',
    topics: 'Chủ đề tài liệu',
    overview: 'Tổng quan',
    noMatches: 'Không tìm thấy hướng dẫn phù hợp.',
    explore: 'Khám phá nền tảng',
    getStarted: 'Bắt đầu với Cloud của bạn',
    intro:
      'Làm theo các hướng dẫn ban đầu, sau đó tham khảo hướng dẫn kỹ thuật khi chọn tài nguyên cho Instance.',
    missing: 'Không tìm thấy hướng dẫn',
    missingDetails: 'Trang tài liệu bạn yêu cầu hiện không có.',
    browse: 'Xem tài liệu',
    more: 'Hướng dẫn khác',
    previous: 'Trước',
    next: 'Tiếp',
    onPage: 'Trong trang này',
    read: 'Đọc hướng dẫn',
  },
};

function TopicContent({ topic, locale }) {
  const { content } = topic;
  const rendered =
    content.type === FlavorArticle || content.type === ImageArticle
      ? content.type(content.props)
      : content;
  return localizeNode(rendered, locale);
}

function makeId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function TopicLink({ topic, currentSlug }) {
  return (
    <Link
      className={`${styles['topic-link']} ${
        currentSlug === topic.slug ? styles['topic-link-active'] : ''
      }`}
      to={topicPath(topic.slug)}
      aria-current={currentSlug === topic.slug ? 'page' : undefined}
    >
      {topic.title}
    </Link>
  );
}

function TopicCard({ topic, readLabel }) {
  return (
    <Link className={styles['topic-card']} to={topicPath(topic.slug)}>
      <BookOutlined className={styles['topic-card-icon']} />
      <span className={styles['topic-card-title']}>{topic.title}</span>
      <span className={styles['topic-card-summary']}>{topic.summary}</span>
      <span className={styles['topic-card-action']}>
        {readLabel} <ArrowRightOutlined />
      </span>
    </Link>
  );
}

function Documentation({ match }) {
  const locale = i18n.getLocale();
  const labels = copy[locale] || copy.en;
  const docsRoot = getDocsRoot();
  const { slug } = match.params;
  const localizedSections = sections.map((section, index) => ({
    title: [labels.start, labels.onboarding, labels.technical][index],
    topics: section.topics.map((topic) => ({
      ...topic,
      title: localizeText(topic.title, locale),
      summary: localizeText(topic.summary, locale),
      sourceTitle: topic.title,
      sourceSummary: topic.summary,
    })),
  }));
  const localizedTopics = localizedSections.reduce(
    (items, section) => items.concat(section.topics),
    []
  );
  const currentTopic = localizedTopics.find((topic) => topic.slug === slug);
  const [search, setSearch] = useState('');
  const [contents, setContents] = useState([]);
  const pageRef = useRef(null);
  const articleRef = useRef(null);
  const searchText = search.trim().toLowerCase();
  const visibleSections = localizedSections
    .map((section) => ({
      ...section,
      topics: section.topics.filter(
        (topic) =>
          !searchText ||
          `${topic.title} ${topic.summary} ${topic.sourceTitle} ${topic.sourceSummary}`
            .toLowerCase()
            .includes(searchText)
      ),
    }))
    .filter((section) => section.topics.length > 0);
  const currentIndex = localizedTopics.findIndex(
    (topic) => topic.slug === slug
  );
  const previousTopic = localizedTopics[currentIndex - 1];
  const nextTopic = localizedTopics[currentIndex + 1];

  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: 'start' });
    const headings = articleRef.current
      ? Array.from(articleRef.current.querySelectorAll('h2, h3'))
      : [];
    const usedIds = {};
    setContents(
      headings.map((heading) => {
        const baseId = makeId(heading.textContent) || 'section';
        usedIds[baseId] = (usedIds[baseId] || 0) + 1;
        const id =
          usedIds[baseId] === 1 ? baseId : `${baseId}-${usedIds[baseId]}`;
        heading.id = id;
        return {
          id,
          title: heading.textContent,
          level: heading.tagName.toLowerCase(),
        };
      })
    );
  }, [slug, locale]);

  return (
    <div className={styles['docs-page']} ref={pageRef}>
      <div className={styles['docs-header']}>
        <div>
          <div className={styles['docs-eyebrow']}>
            Sovereign Next / {labels.helpCenter}
          </div>
          {slug ? (
            <p className={styles['docs-title']}>{labels.documentation}</p>
          ) : (
            <h1 className={styles['docs-title']}>{labels.documentation}</h1>
          )}
          <p>{labels.tagline}</p>
        </div>
        <label className={styles['docs-search']} htmlFor="docs-search-input">
          <SearchOutlined aria-hidden="true" />
          <input
            id="docs-search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={labels.find}
            aria-label={labels.find}
          />
        </label>
      </div>

      <div className={styles['docs-layout']}>
        <aside className={styles['docs-sidebar']} aria-label={labels.topics}>
          <Link
            className={`${styles['topic-link']} ${
              !slug ? styles['topic-link-active'] : ''
            }`}
            to={docsRoot}
            aria-current={!slug ? 'page' : undefined}
          >
            {labels.overview}
          </Link>
          {visibleSections.map((section) => (
            <div key={section.title} className={styles['nav-section']}>
              <h2>{section.title}</h2>
              {section.topics.map((topic) => (
                <TopicLink key={topic.slug} topic={topic} currentSlug={slug} />
              ))}
            </div>
          ))}
          {searchText && visibleSections.length === 0 && (
            <p className={styles['empty-search']}>{labels.noMatches}</p>
          )}
        </aside>

        <div className={styles['docs-main']}>
          {!slug && (
            <div className={styles['docs-overview']}>
              <div className={styles['overview-heading']}>
                <span className={styles['section-label']}>
                  {labels.explore}
                </span>
                <h2>{labels.getStarted}</h2>
                <p>{labels.intro}</p>
              </div>
              {visibleSections.map((section) => (
                <section key={section.title} className={styles['card-section']}>
                  <h3>{section.title}</h3>
                  <div className={styles['topic-grid']}>
                    {section.topics.map((topic) => (
                      <TopicCard
                        key={topic.slug}
                        topic={topic}
                        readLabel={labels.read}
                      />
                    ))}
                  </div>
                </section>
              ))}
              {searchText && visibleSections.length === 0 && (
                <p className={styles['empty-search']}>{labels.noMatches}</p>
              )}
            </div>
          )}

          {slug && !currentTopic && (
            <div className={styles['missing-topic']}>
              <h2>{labels.missing}</h2>
              <p>{labels.missingDetails}</p>
              <Link to={docsRoot}>{labels.browse}</Link>
            </div>
          )}

          {currentTopic && (
            <div className={styles['article-layout']}>
              <article className={styles.article}>
                <div className={styles['article-breadcrumb']}>
                  <Link to={docsRoot}>{labels.documentation}</Link>
                  <span aria-hidden="true">/</span>
                  <span>{currentTopic.title}</span>
                </div>
                <h1>{currentTopic.title}</h1>
                <p className={styles['article-summary']}>
                  {currentTopic.summary}
                </p>
                <div className={styles['article-body']} ref={articleRef}>
                  <TopicContent topic={currentTopic} locale={locale} />
                </div>
                <nav
                  className={styles['article-pagination']}
                  aria-label={labels.more}
                >
                  {previousTopic ? (
                    <Link to={topicPath(previousTopic.slug)}>
                      <ArrowLeftOutlined /> {labels.previous}
                      <strong>{previousTopic.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {nextTopic && (
                    <Link to={topicPath(nextTopic.slug)}>
                      {labels.next} <ArrowRightOutlined />
                      <strong>{nextTopic.title}</strong>
                    </Link>
                  )}
                </nav>
              </article>
              {contents.length > 0 && (
                <aside
                  className={styles['article-contents']}
                  aria-label={labels.onPage}
                >
                  <h2>{labels.onPage}</h2>
                  {contents.map((item) => (
                    <a
                      key={item.id}
                      className={
                        item.level === 'h3' ? styles['content-subheading'] : ''
                      }
                      href={`#${item.id}`}
                    >
                      {item.title}
                    </a>
                  ))}
                </aside>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documentation;
