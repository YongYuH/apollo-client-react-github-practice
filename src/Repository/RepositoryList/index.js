import React, { Fragment } from "react";

import FetchMore from "../../FetchMore";
import RepositoryItem from "../RepositoryItem";
import "../style.css";

const updateQuery = (previousResult = {}, { fetchMoreResult = {} }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges
        ]
      }
    }
  };
};

const RepositoryList = ({ fetchMore, loading, repositories }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div className="RepositoryItem" key={node.id}>
        <RepositoryItem {...node} />
      </div>
    ))}

    <FetchMore
      fetchMore={fetchMore}
      hasNextPage={repositories.pageInfo.hasNextPage}
      loading={loading}
      variables={{
        cursor: repositories.pageInfo.endCursor
      }}
      updateQuery={updateQuery}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;
