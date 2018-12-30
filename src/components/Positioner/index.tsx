import * as React from "react";
import Rect from "@reach/rect";
// import { Position } from 'types'

export type Position = "top" | "bottom" | "left" | "right";

// default props
interface IDefaultProps {
  position: Position;
}

// required props
interface IProps extends Partial<IDefaultProps> {
  children: ({ rect, ref }: API) => React.ReactNode;
  observe: boolean;
}

interface IState {
  position: Position;
}

interface API {
  ref: (node: HTMLDivElement) => void;
  rect: DOMRect;
}

const initialState = {
  position: "top" as Position
};

const styles: React.CSSProperties = {
  position: "fixed"
};

class Positioner extends React.Component<IProps, IState> {
  Target: React.ReactNode;
  node?: HTMLDivElement;

  readonly state: IState = initialState;

  static defaultProps: IDefaultProps = {
    position: "top"
  };

  private getApi({ rect, ref }: API): API {
    return {
      ref,
      rect
    };
  }

  render() {
    const { children, observe } = this.props;

    return (
      <Rect observe={observe}>
        {({ rect, ref }: API) => (
          <div style={styles}>{children(this.getApi({ rect, ref }))}</div>
        )}
      </Rect>
    );
  }
}

export default Positioner;
