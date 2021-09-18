/**
 *
 * StrapiProvider
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import StrapiContext from '../../contexts/StrapiContext';

const StrapiProvider = ({ children, datoit }) => {
  return <StrapiContext.Provider value={{ datoit }}>{children}</StrapiContext.Provider>;
};

StrapiProvider.defaultProps = {};
StrapiProvider.propTypes = {
  children: PropTypes.node.isRequired,
  datoit: PropTypes.object.isRequired,
};

export default StrapiProvider;
