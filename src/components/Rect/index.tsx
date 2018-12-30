import * as React from "react";
import Rect from "@reach/rect";

interface IChildren {
  ref: (node: HTMLDivElement) => void;
  rect: DOMRect;
}

// default props
interface IDefaultProps {
  observe: boolean;
  onChange?: (rect: DOMRect) => any;
}

// Simple ref setter
type setRef = (ref: HTMLDivElement) => any;

// required props
interface IProps extends Partial<IDefaultProps> {
  children: ({ rect, ref }: IChildren) => React.ReactNode;
}

class DecoratedRect extends React.Component<IProps, {}> {
  static defaultProps: IDefaultProps = {
    observe: false
  };

  private el?: HTMLDivElement;

  calculateRectDims = (rect: DOMRect): DOMRect => {
    if (!this.el || !rect) return rect;

    const styles: CSSStyleDeclaration = window.getComputedStyle(this.el);

    // Account for margins in element dimensions
    return {
      ...rect,
      x: rect.x,
      y: rect.y,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      width:
        rect.width +
        parseInt(styles.marginLeft || "0") +
        parseInt(styles.marginRight || "0"),
      height:
        rect.height +
        parseInt(styles.marginTop || "0") +
        parseInt(styles.marginBottom || "0")
    };
  };

  public onChange = (rect: DOMRect) => {
    if (this.props.onChange) {
      this.props.onChange(this.calculateRectDims(rect));
    }
  };

  public setRef = (el: HTMLDivElement, ref: setRef): void => {
    this.el = el;
    ref(this.el);
  };

  render() {
    const { observe, children } = this.props;
    return (
      <Rect observe={observe} onChange={this.onChange}>
        {({ ref, rect }: IChildren) =>
          children({
            rect: this.calculateRectDims(rect),
            ref: el => this.setRef(el, ref)
          })
        }
      </Rect>
    );
  }
}

export default DecoratedRect;
