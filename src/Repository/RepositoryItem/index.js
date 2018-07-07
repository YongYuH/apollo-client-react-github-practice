import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import REPOSITORY_FRAGMENT from "../fragments";
import Button from "../../Button";
import Link from "../../Link";
import "../style.css";

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
  mutation($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const WATCH_REPOSITORY = gql`
  mutation($repositoryId: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $repositoryId }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED"
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateAddStar = (
  client,
  {
    data: {
      addStar: {
        starrable: { id }
      }
    }
  }
) => {
  const repository = client.readFragment({
    fragment: REPOSITORY_FRAGMENT,
    id: `Repository:${id}`
  });

  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
};

const updateRemoveStar = (
  client,
  {
    data: {
      removeStar: {
        starrable: { id }
      }
    }
  }
) => {
  const repository = client.readFragment({
    fragment: REPOSITORY_FRAGMENT,
    id: `Repository:${id}`
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount
      }
    }
  });
};

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription }
      }
    }
  }
) => {
  const repository = client.readFragment({
    fragment: REPOSITORY_FRAGMENT,
    id: `Repository:${id}`
  });

  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  client.writeFragment({
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    },
    fragment: REPOSITORY_FRAGMENT,
    id: `Repository:${id}`
  });
};

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
  watchers
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <div>{stargazers.totalCount} stars</div>
        {!viewerHasStarred ? (
          <Mutation
            mutation={ADD_STAR}
            variables={{ repositoryId: id }}
            update={updateAddStar}
          >
            {(addStar, { data, error, loading }) => (
              <Button className="Repository-title-action" onClick={addStar}>
                Star
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={REMOVE_STAR}
            variables={{ repositoryId: id }}
            update={updateRemoveStar}
          >
            {(removeStar, { data, error, loading }) => (
              <Button className="Repository-title-action" onClick={removeStar}>
                Unstar
              </Button>
            )}
          </Mutation>
        )}

        <Mutation
          mutation={WATCH_REPOSITORY}
          optimisticResponse={{
            updateSubscription: {
              __typename: "Mutation",
              subscribable: {
                __typename: "Repository",
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
              }
            }
          }}
          variables={{
            repositoryId: id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, error, loading }) => (
            <Button
              className="RepositoryItem-title-action"
              onClick={updateSubscription}
            >
              {watchers.totalCount}{" "}
              {isWatch(viewerSubscription) ? "Unwatch" : "Watch"}
            </Button>
          )}
        </Mutation>
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
