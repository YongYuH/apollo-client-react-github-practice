import React from 'react';

import RepositoryItem from '../RepositoryItem';
import '../style.css';

const RepositoryList = ({ repositories }) => (
  repositories.edges.map(({ node }) => (
    <div
      className="RepositoryItem"
      key={node.id}
    >
      <RepositoryItem {...node} />
    </div>
  ))
);

export default RepositoryList;
