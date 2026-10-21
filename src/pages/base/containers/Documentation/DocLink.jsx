import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { topicPath } from './paths';

function DocLink({ slug, children }) {
  return <Link to={topicPath(slug)}>{children}</Link>;
}

DocLink.propTypes = {
  slug: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DocLink;
