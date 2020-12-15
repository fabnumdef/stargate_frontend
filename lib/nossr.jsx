import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React from 'react';

const NoSsr = ({ children }) => <>{children}</>;

NoSsr.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
