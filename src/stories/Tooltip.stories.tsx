import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import Tooltip from "components/Tooltip";
import { Position, Alignment } from "types";

const positions: Position[] = ["top", "bottom", "left", "right"];
const alignments: Alignment[] = ["start", "middle", "end"];

const styles: React.CSSProperties = {
  position: "absolute",
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center"
};

storiesOf("Tooltip", module)
  .add("Basic content", () => (
    <div style={styles}>
      <Tooltip content="Hello">
        <div>Hover Me!</div>
      </Tooltip>
    </div>
  ))
  .add("Click trigger", () => (
    <div style={styles}>
      <Tooltip content="Hello" trigger="click">
        <div>Click Me!</div>
      </Tooltip>
    </div>
  ))
  .add("Custom styles", () => (
    <div style={styles}>
      <Tooltip
        content="Hello"
        style={{ color: "#FFF", textDecoration: 'underline', width: 300, padding: 50 }}
        backgroundColor="#000"
      >
        <div>Hover Me!</div>
      </Tooltip>
    </div>
  ))
  .add("Content render props", () => (
    <div style={styles}>
      <Tooltip
        position="bottom"
        content={({ getProps, isOpen }: any) => (
          <div {...getProps()}>Tooltip isOpen: {isOpen.toString()}</div>
        )}
      >
        Hover Me!
      </Tooltip>
    </div>
  ))
  .add("Children render props", () => (
    <div style={styles}>
      <Tooltip content="Hello">
        {({ getProps }) => <div {...getProps()}>Hover Me!</div>}
      </Tooltip>
    </div>
  ))
  .add(
    "Controllable",
    withState({
      isOpen: false
    })(({ store }) => (
      <div>
        <button onClick={() => store.set({ isOpen: !store.state.isOpen })}>
          Set to {store.state.isOpen ? "Closed" : "Open"}
        </button>
        <div style={styles}>
          <Tooltip
            isOpen={store.state.isOpen}
            content="Hello"
            closeOnClickOutside={false}
          >
            I am Controllable, click the button above.
          </Tooltip>
        </div>
      </div>
    ))
  )
  .add(
    "Positions & Alignments",
    withState({
      position: "left" as Position,
      alignment: "start" as Alignment
    })(({ store }) => (
      <div>
        <div style={{ display: "flex" }}>
          <span>Position:</span>
          {positions.map(p => (
            <div>
              <input
                type="radio"
                name="position"
                id={p}
                value={p}
                checked={store.state.position === p}
                onChange={e =>
                  store.set({ position: e.target.value as Position })
                }
              />
              <label htmlFor={p}>{p}</label>
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <span>Alignment:</span>
          {alignments.map(a => (
            <div>
              <input
                type="radio"
                name="alignment"
                id={a}
                value={a}
                checked={store.state.alignment === a}
                onChange={e =>
                  store.set({ alignment: e.target.value as Alignment })
                }
              />
              <label htmlFor={a}>{a}</label>
            </div>
          ))}
        </div>
        <div style={styles}>
          <Tooltip
            content={({ getProps, isOpen }: any) => (
              <div {...getProps()}>Tooltip isOpen: {isOpen.toString()}</div>
            )}
            trigger="click"
            position={store.state.position}
            alignment={store.state.alignment}
            closeOnClickOutside={false}
          >
            Click Me!
          </Tooltip>
        </div>
      </div>
    ))
  );
