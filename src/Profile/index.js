import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading';
import RepositoryList from '../Repository';
import ErrorMessage from '../Error';

const GET_REPOSITORY_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
      ) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

const Profile = () => (
  <Query query={GET_REPOSITORY_OF_CURRENT_USER}>
    {({
      data,
      error,
      loading,
    }) => {
      const { viewer } = data;

      if (error) {
        return <ErrorMessage error={error} />
      }

      if (loading || !viewer) {
        return (
          <Loading />
        );
      }

      return (
        <RepositoryList repositories={viewer.repositories} />
      );
    }}
  </Query>
);

export default Profile;
