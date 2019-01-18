# Reactive GraphQL React

React Hook bindings for [reactive-graphql](https://github.com/mesosphere/reactive-graphql).

## Usage

```ts
import getReactiveGraphqlReact from "reactive-graphql-react";

const schema = getSchema(); // get a GraphQL schema
const queryGraphql = getReactiveGraphqlReact(schema); // get the hook

export default function MyComponent() {
  // Always up-to-date data
  const [result, error] = queryGraphql(`
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

## License

MIT
