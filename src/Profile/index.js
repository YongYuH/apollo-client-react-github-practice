import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Loading from "../Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "../Repository";
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query GetRepositoriesOfCurrentUser($cursor: String) {
    viewer {
      repositories(
        after: $cursor
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

const Profile = () => (
  <Query
    notifyOnNetworkStatusChange={true}
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    variables={{
      cursor: null
    }}
  >
    {({ data, error, fetchMore, loading }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      return (
        <RepositoryList
          fetchMore={fetchMore}
          loading={loading}
          repositories={viewer.repositories}
        />
      );
    }}
  </Query>
);

export default Profile;
