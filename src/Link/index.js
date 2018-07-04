import React from 'react';

const Link = ({
  children,
  ...props,
}) => (
  <a
    target="_blank"
    {...props}
  >
    {children}
  </a>
);

export default Link;
