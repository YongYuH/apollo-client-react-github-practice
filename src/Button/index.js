import React from 'react';

import './style.css';

const Button = ({
  children,
  className,
  color,
  type,
  ...props,
}) => (
  <button
    className={`${className} Button Button_${color}`}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
