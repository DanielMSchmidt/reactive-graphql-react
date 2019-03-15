import { useMemo } from "react";
import { GraphQLSchema, DocumentNode } from "graphql";
import graphql from "reactive-graphql";

import useObservable from "./useObservable";

type ReactiveGraphQLResponse = {
  data: any;
};

export default function getReactiveGraphqlReact(schema: GraphQLSchema) {
  if (!(schema instanceof GraphQLSchema)) {
    throw new Error("schema needs to be a GraphQLSchema");
  }

  return function useReactiveGraphqlReact(
    query: DocumentNode,
    context?: Object
  ) {
    const observable = useMemo(() => graphql(query, schema, context || {}), [
      query,
      JSON.stringify(context)
    ]);

    const [data, errors] = useObservable<ReactiveGraphQLResponse, any[]>(
      observable,
      null
    );
    return [data === null ? data : data.data, errors];
  };
}
