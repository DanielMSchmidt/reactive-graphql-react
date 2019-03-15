import * as React from "react";
import ReactTestRenderer from "react-test-renderer";
import useObservable from "../useObservable";
import { BehaviorSubject, from, of } from "rxjs";

const { act } = ReactTestRenderer;

describe("useObservable", () => {
  it("accepts initial values", () => {
    function Subject() {
      const [success] = useObservable(of(), "i'm here!");
      return success;
    }

    const root = ReactTestRenderer.create(<Subject />);
    expect(root).toMatchInlineSnapshot(`"i'm here!"`);
  });

  it("uses last value of observable", () => {
    function Subject() {
      const [success] = useObservable(from([1, 2, 3]));
      return success;
    }

    const root = ReactTestRenderer.create(<Subject />);

    // simulate a componentMounted by acting up!
    act(() => {});

    expect(root).toMatchInlineSnapshot(`"3"`);
  });

  it("receives updates from observable", () => {
    const observable = new BehaviorSubject(1);

    function Subject() {
      const [success] = useObservable(observable);
      return success;
    }

    const root = ReactTestRenderer.create(<Subject />);

    act(() => {
      observable.next(2);
    });
    expect(root).toMatchInlineSnapshot(`"2"`);
  });

  it("emits errors", () => {
    const observable = new BehaviorSubject(1);

    function Subject() {
      const [, error] = useObservable(observable);
      return error;
    }

    const root = ReactTestRenderer.create(<Subject />);

    act(() => {
      observable.error("some error occurred!");
    });
    expect(root).toMatchInlineSnapshot(`"some error occurred!"`);
  });
});
