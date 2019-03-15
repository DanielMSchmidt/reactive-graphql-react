import * as React from "react";
import ReactTestRenderer from "react-test-renderer";
import { makeExecutableSchema } from "graphql-tools";
import gql from "graphql-tag";
import useReactiveGraphqlFactory from "..";

const { act } = ReactTestRenderer;
let counter = 0;
const schema = makeExecutableSchema({
  typeDefs: `
  type Query {
      num: Int!
      bool: Boolean!
      error: Float
      counting: Int!
      context: Int!
  }
  `,
  resolvers: {
    Query: {
      num() {
        return 42;
      },
      bool() {
        return true;
      },
      error() {
        throw new Error("Ups");
      },
      counting() {
        counter = counter + 1;
        return counter;
      },
      context(_parent, _args, context) {
        return context.num;
      }
    }
  }
});

describe("getReactiveGraphqlReact", () => {
  beforeEach(() => {
    counter = 0;
  });
  describe("factory", () => {
    it("throws if factory gets no schema", () => {
      expect(() => {
        useReactiveGraphqlFactory(null);
      }).toThrowErrorMatchingInlineSnapshot(
        `"schema needs to be a GraphQLSchema"`
      );
    });

    it("returns a hook", () => {
      expect(useReactiveGraphqlFactory(schema)).toBeInstanceOf(Function);
    });
  });

  describe("hook", () => {
    const useGraphql = useReactiveGraphqlFactory(schema);

    it("queries data", () => {
      function Subject() {
        const [data] = useGraphql(gql`
          query {
            num
          }
        `);

        return data === null ? null : data.num;
      }

      const root = ReactTestRenderer.create(<Subject />);

      // simulate a componentMounted by acting up!
      act(() => {});

      expect(root).toMatchInlineSnapshot(`"42"`);
    });

    it("queries data with changing query", () => {
      function Subject({ query }) {
        const [data] = useGraphql(query);

        if (data !== null && data.bool) {
          return "Oh yes";
        }

        return data === null ? null : data.num;
      }

      const root = ReactTestRenderer.create(
        <Subject
          query={gql`
            query {
              num
            }
          `}
        />
      );

      root.update(
        <Subject
          query={gql`
            query {
              num
              bool
            }
          `}
        />
      );
      act(() => {});

      expect(root).toMatchInlineSnapshot(`"Oh yes"`);
    });

    it("queries data with same query", () => {
      function Subject({ query }) {
        const [data] = useGraphql(query);

        return data === null ? null : data.counting;
      }

      const root = ReactTestRenderer.create(
        <Subject
          query={gql`
            query {
              counting
            }
          `}
        />
      );
      act(() => {});

      root.update(
        <Subject
          query={gql`
            query {
              counting
            }
          `}
        />
      );
      act(() => {});

      expect(root).toMatchInlineSnapshot(`"1"`);
    });

    it("throws errors", () => {
      function Subject() {
        const [data, error] = useGraphql(gql`
          query {
            error
          }
        `);

        if (error) {
          return error.toString();
        }

        return data === null ? null : data.num;
      }

      const root = ReactTestRenderer.create(<Subject />);
      act(() => {});

      expect(root).toMatchInlineSnapshot(
        `"Error: reactive-graphql: resolver 'error' throws this error: 'Error: Ups'"`
      );
    });

    it("queries data with same query", () => {
      function Subject({ query, num }) {
        const [data] = useGraphql(query, {
          num
        });

        return data === null ? null : data.context + "-" + data.counting;
      }

      const root = ReactTestRenderer.create(
        <Subject
          query={gql`
            query {
              context
              counting
            }
          `}
          num={1}
        />
      );
      act(() => {});

      root.update(
        <Subject
          query={gql`
            query {
              context
              counting
            }
          `}
          num={1}
        />
      );
      act(() => {});

      expect(root).toMatchInlineSnapshot(`"1-1"`);

      root.update(
        <Subject
          query={gql`
            query {
              context
              counting
            }
          `}
          num={2}
        />
      );
      act(() => {});
      expect(root).toMatchInlineSnapshot(`"2-2"`);
    });
  });
});
