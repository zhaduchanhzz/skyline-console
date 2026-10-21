import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { FlavorArticle, ImageArticle } from './Articles';
import { onboardingTopics } from './Onboarding';
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
const allTopics = sections.reduce(
  (items, section) => items.concat(section.topics),
  []
);

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

function TopicCard({ topic }) {
  return (
    <Link className={styles['topic-card']} to={topicPath(topic.slug)}>
      <BookOutlined className={styles['topic-card-icon']} />
      <span className={styles['topic-card-title']}>{topic.title}</span>
      <span className={styles['topic-card-summary']}>{topic.summary}</span>
      <span className={styles['topic-card-action']}>
        Read guide <ArrowRightOutlined />
      </span>
    </Link>
  );
}

function Documentation({ match }) {
  const docsRoot = getDocsRoot();
  const { slug } = match.params;
  const currentTopic = allTopics.find((topic) => topic.slug === slug);
  const [search, setSearch] = useState('');
  const [contents, setContents] = useState([]);
  const pageRef = useRef(null);
  const articleRef = useRef(null);
  const searchText = search.trim().toLowerCase();
  const visibleSections = sections
    .map((section) => ({
      ...section,
      topics: section.topics.filter(
        (topic) =>
          !searchText ||
          `${topic.title} ${topic.summary}`.toLowerCase().includes(searchText)
      ),
    }))
    .filter((section) => section.topics.length > 0);
  const currentIndex = allTopics.findIndex((topic) => topic.slug === slug);
  const previousTopic = allTopics[currentIndex - 1];
  const nextTopic = allTopics[currentIndex + 1];

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
  }, [slug]);

  return (
    <div className={styles['docs-page']} ref={pageRef}>
      <div className={styles['docs-header']}>
        <div>
          <div className={styles['docs-eyebrow']}>
            Sovereign Next / Help center
          </div>
          {slug ? (
            <p className={styles['docs-title']}>Documentation</p>
          ) : (
            <h1 className={styles['docs-title']}>Documentation</h1>
          )}
          <p>Everything you need to build and operate your private cloud.</p>
        </div>
        <label className={styles['docs-search']} htmlFor="docs-search-input">
          <SearchOutlined aria-hidden="true" />
          <input
            id="docs-search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a guide"
            aria-label="Find a guide"
          />
        </label>
      </div>

      <div className={styles['docs-layout']}>
        <aside
          className={styles['docs-sidebar']}
          aria-label="Documentation topics"
        >
          <Link
            className={`${styles['topic-link']} ${
              !slug ? styles['topic-link-active'] : ''
            }`}
            to={docsRoot}
            aria-current={!slug ? 'page' : undefined}
          >
            Overview
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
            <p className={styles['empty-search']}>No matching guides.</p>
          )}
        </aside>

        <div className={styles['docs-main']}>
          {!slug && (
            <div className={styles['docs-overview']}>
              <div className={styles['overview-heading']}>
                <span className={styles['section-label']}>
                  Explore the platform
                </span>
                <h2>Get started with your cloud</h2>
                <p>
                  Follow the onboarding guides, then use the reference guides
                  when choosing resources for an instance.
                </p>
              </div>
              {visibleSections.map((section) => (
                <section key={section.title} className={styles['card-section']}>
                  <h3>{section.title}</h3>
                  <div className={styles['topic-grid']}>
                    {section.topics.map((topic) => (
                      <TopicCard key={topic.slug} topic={topic} />
                    ))}
                  </div>
                </section>
              ))}
              {searchText && visibleSections.length === 0 && (
                <p className={styles['empty-search']}>No matching guides.</p>
              )}
            </div>
          )}

          {slug && !currentTopic && (
            <div className={styles['missing-topic']}>
              <h2>Guide not found</h2>
              <p>The requested documentation page is not available.</p>
              <Link to={docsRoot}>Browse documentation</Link>
            </div>
          )}

          {currentTopic && (
            <div className={styles['article-layout']}>
              <article className={styles.article}>
                <div className={styles['article-breadcrumb']}>
                  <Link to={docsRoot}>Documentation</Link>
                  <span aria-hidden="true">/</span>
                  <span>{currentTopic.title}</span>
                </div>
                <h1>{currentTopic.title}</h1>
                <p className={styles['article-summary']}>
                  {currentTopic.summary}
                </p>
                <div className={styles['article-body']} ref={articleRef}>
                  {currentTopic.content}
                </div>
                <nav
                  className={styles['article-pagination']}
                  aria-label="More guides"
                >
                  {previousTopic ? (
                    <Link to={topicPath(previousTopic.slug)}>
                      <ArrowLeftOutlined /> Previous
                      <strong>{previousTopic.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {nextTopic && (
                    <Link to={topicPath(nextTopic.slug)}>
                      Next <ArrowRightOutlined />
                      <strong>{nextTopic.title}</strong>
                    </Link>
                  )}
                </nav>
              </article>
              {contents.length > 0 && (
                <aside
                  className={styles['article-contents']}
                  aria-label="On this page"
                >
                  <h2>On this page</h2>
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
