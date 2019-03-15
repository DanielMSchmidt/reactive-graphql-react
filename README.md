# Reactive GraphQL React

React Hook bindings for [reactive-graphql](https://github.com/mesosphere/reactive-graphql).

## Usage

```ts
import gql from "graphql-tag";
import getReactiveGraphqlReact from "reactive-graphql-react";

const schema = getSchema(); // get a GraphQL schema
const useGraphql = getReactiveGraphqlReact(schema); // get the hook

export default function MyComponent() {
  // Always up-to-date data
  const [result, error] = useGraphql(gql`
    query {
      posts {
        title
        author {
          name
        }
      }
    }
  `);

  if (error) {
    return <h3>There has been an error fetching the data</h3>;
  }

  if (!result) {
    return <h3>Loading, please wait</h3>;
  }

  const {
    data: { posts }
  } = result;

  return <PostList items={posts} />;
}
```

## Setup

You need React in `>= 16.8.0-alpha.1`. Besides just run `npm install --save reactive-graphql-react` and you are ready to go.

## License

MIT
