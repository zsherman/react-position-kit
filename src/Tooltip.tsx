import * as React from 'react'
// import Positioner from 'components/Positioner'

enum WindowRegion {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

function windowRegion(mouseX: number, mouseY: number) {
  const halfHeight = window.window.innerHeight * .5;
  if (mouseX <= window.window.innerWidth * .5) {
    return mouseY <= halfHeight ? WindowRegion.TopLeft : WindowRegion.BottomLeft;
  }
  return mouseY <= halfHeight ? WindowRegion.TopRight : WindowRegion.BottomRight;
}

export interface TooltipProps {
  content: any;
  tooltipClassName?: string;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
}

export interface TooltipState {
  x: number;
  y: number;
  wndRegion: WindowRegion;
  hidden: boolean;
  ttClassName: string;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      wndRegion: WindowRegion.TopLeft,
      hidden: true,
      ttClassName: this.props.tooltipClassName || 'Tooltip',
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }

  onMouseMove = (e: React.MouseEvent) => {
    if (this.state.hidden == true) return;
    this.setState({
      x: e.clientX,
      y: e.clientY
    } as any);
  }

  onMouseEnter = (e: React.MouseEvent) => {
    this.setState({
      hidden: false,
      wndRegion: windowRegion(e.clientX, e.clientY),
    } as any);
  }

  onMouseleave = () => {
    this.setState({ hidden: true } as any);
  }

  computeStyle = (): React.CSSProperties => {
    switch (this.state.wndRegion) {
      case WindowRegion.TopLeft:
        return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case WindowRegion.TopRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          top: `${this.state.y + this.state.offsetTop}px`
        };
      case WindowRegion.BottomLeft:
        return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
      case WindowRegion.BottomRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`
        };
    }
  }

  render() {
    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseleave} onMouseMove={this.onMouseMove}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div style={this.computeStyle()}>{this.props.content}</div>
        }
      </div>
    )
  }
}

export default Tooltip
