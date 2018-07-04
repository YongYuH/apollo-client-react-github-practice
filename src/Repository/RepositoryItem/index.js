import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Button from '../../Button';
import Link from '../../Link';
import '../style.css';

const ADD_STAR = gql`
  mutation($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation ($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const RepositoryItem = ({
  descriptionHTML,
  id,
  name,
  owner,
  primaryLanguage,
  stargazers,
  url,
  viewerHasStarred,
  viewerSubscription,
  watchers,
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>
          {name}
        </Link>
      </h2>

      <div>
        {
          !viewerHasStarred ? (
            <Mutation
              mutation={ADD_STAR}
              variables={{ repositoryId: id }}
            >
              {
                (
                  addStar,
                  {
                    data,
                    error,
                    loading,
                  }
                ) => (
                  <Button
                    className="Repository-title-action"
                    onClick={addStar}
                  >
                    {stargazers.totalCount} Star
                  </Button>
                )
              }
            </Mutation>
          ) : (
            <Mutation
              mutation={REMOVE_STAR}
              variables={{ repositoryId: id }}
            >
              {
                (
                  removeStar,
                  {
                    data,
                    error,
                    loading,
                  }
                ) => (
                  <Button
                    className="Repository-title-action"
                    onClick={removeStar}
                  >
                    {stargazers.totalCount} Unstar
                  </Button>
                )
              }
            </Mutation>
          )
        }
        {/* Here comes your updateSubscription mutation */}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {
            primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )
          }
        </div>
        <div>
          {
            owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )
          }
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
