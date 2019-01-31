import React from "react";
import renderer from "react-test-renderer";
import { from } from "rxjs";

import useObservable from "../useObservable";

function TransparentHost({ stream }) {
  const [value, error] = useObservable(stream, null);

  if (error) {
    return <React.Fragment>{JSON.stringify(error)}</React.Fragment>;
  }

  if (!value) {
    <React.Fragment>Nothing</React.Fragment>;
  }

  return <React.Fragment>{JSON.stringify(value)}</React.Fragment>;
}

describe("useObservable", () => {
  it("subscribes to the observable", () => {
    const stream = from([]);
    const tree = renderer.create(<TransparentHost stream={stream} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
