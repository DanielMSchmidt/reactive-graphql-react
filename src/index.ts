import { useMemo } from "react";
import { GraphQLSchema } from "graphql";
import graphql from "reactive-graphql";
import gql from "graphql-tag";

import useObservable from "./useObservable";

export default function getReactiveGraphqlReact(schema: GraphQLSchema) {
  return function reactiveGraphqlReact(query: string, context?: Object) {
    const observable = useMemo(
      () =>
        graphql(
          gql`
            ${query}
          `,
          schema,
          context || {}
        ),
      [query, JSON.stringify(context)]
    );

    return useObservable(observable, null);
  };
}
