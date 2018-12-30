import * as React from 'react'
import Rect from 'components/Rect'
// import { Position, Alignment } from 'types'
import { uniq, fitOnBestSide } from './utils'
import Arrow from '../Arrow'

// type ChildFunction = React.StatelessComponent<IChildProps>;
type ContentFunction = (props: IContentProps) => React.ReactNode;
type ChildFunction = (props: IChildProps) => React.ReactNode;
type Children = React.ReactNode | ChildFunction;
type Content = React.ReactNode | ContentFunction;
type Position = "top" | "bottom" | "left" | "right";
type Alignment = "start" | "middle" | "end";
type Interaction = "click" | "hover" | "touch";
type Ref = (node: HTMLDivElement) => void;
type InteractionEvent = React.MouseEvent | React.TouchEvent;
type InteractionHandler = (e: InteractionEvent) => void;

function isChildFunction(arg: any): arg is ChildFunction {
  return typeof arg === 'function';
}

function isContentFunction(arg: any): arg is ContentFunction {
  return typeof arg === 'function';
}

interface IProps {
  isOpen?: boolean;
  content: Content;
  children: Children;
  trigger: Interaction | Array<Interaction>;
  position: Position | Array<Position>;
  alignment: Alignment | Array<Alignment>;
  autoPosition: Array<Position>;
  autoAlign: Array<Alignment>;
  unmountDelay: number;
  offset: number;
  allowOverflow: boolean;
  hasArrow: boolean;
  arrowSize: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  onMouseEnter?: InteractionHandler;
  onMouseLeave?: InteractionHandler;
  onClick?: InteractionHandler;
}

interface IContentProps {
  isOpen?: boolean;
  toggleIsOpen?: (isOpen?: boolean) => void;
  getProps: any;
}

interface IChildProps {
  ref: Ref;
  toggleIsOpen?: (isOpen?: boolean) => void;
  onMouseEnter?: InteractionHandler;
  onMouseLeave?: InteractionHandler;
  onClick?: InteractionHandler;
}

interface IState {
  isOpen: boolean;
}

const initialState: IState = {
  isOpen: false,
}

class Tooltip extends React.Component<IProps, IState> {
  static defaultProps = {
    position: "top",
    alignment: "middle",
    autoPosition: ["top", "right", "left", "bottom"],
    autoAlign: ["start", "middle", "end"],
    trigger: ['click', 'hover'],
    unmountDelay: 100,
    allowOverflow: false,
    backgroundColor: '#eee',
    borderColor: '#000',
    borderWidth: 1,
    hasArrow: true,
    arrowSize: 8,
    offset: 15,
  }

  readonly state: IState = initialState

  private unmountTimerId?: number;
  private rootRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    if (this.unmountTimerId) {
      clearTimeout(this.unmountTimerId);
    }

    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (e: MouseEvent) => {
    const node = this.rootRef.current
    if (node && !node.contains(e.target as Node)) {
      // this.toggleIsOpen(false);
    }
  }

  toggleIsOpen = (isOpen?: boolean): void => {
    const { unmountDelay } = this.props

    if (this.unmountTimerId) {
      clearTimeout(this.unmountTimerId);
      this.unmountTimerId = undefined;
    }

    this.setState((state: IState) => {
      const nextIsOpen = typeof isOpen === 'undefined'
        ? !state.isOpen
        : isOpen

      if (!nextIsOpen) {
        this.unmountTimerId = window.setTimeout(() => {
          this.setState({
            isOpen: false
          });
        }, unmountDelay);
        return null;
      }

      return {
        isOpen: nextIsOpen,
      };
    })
  }

  onMouseEnter = (e: React.MouseEvent): void => {
    const { onMouseEnter } = this.props
    if (onMouseEnter) onMouseEnter(e)
    this.toggleIsOpen(true);
  }

  onMouseLeave = (e: React.MouseEvent): void => {
    const { onMouseLeave } = this.props
    if (onMouseLeave) onMouseLeave(e)
    this.toggleIsOpen(false)
  }

  onClick = (e: React.MouseEvent<HTMLElement>): void => {
    const { onClick } = this.props
    if (onClick) onClick(e)
    this.toggleIsOpen(true)
  }

  calculatePosition(anchorRect: DOMRect, contentRect?: DOMRect): any {
    const {
      position,
      alignment,
      autoPosition,
      allowOverflow,
      offset,
      hasArrow,
      arrowSize,
    } = this.props

    // Position priority list
    let positions: Array<Position>

    // Get the final position preferences
    // TypeScript won't let us concat string | array so we
    // have to separate out these blocks
    if (typeof position === 'string') {
      positions = [position, ...autoPosition]
    } else {
      positions = [...position, ...autoPosition]
    }

    // Get the final styles for the content renderer
    const fit = fitOnBestSide({
      positions: positions.filter(uniq),
      alignment,
      anchorRect,
      contentRect,
      allowOverflow,
      offset,
      hasArrow,
      arrowSize,
    })

    return fit
  }

  getContentStyles (): React.CSSProperties {
    const {
      backgroundColor,
      borderWidth,
      borderColor,
    } = this.props
    return {
      backgroundColor,
      borderWidth,
      borderColor,
      borderStyle: 'solid',
      padding: 15,
    }
  }

  renderContent(anchorRect: DOMRect): React.ReactNode {
    const { isOpen } = this.state
    const {
      content,
      hasArrow,
      arrowSize,
      backgroundColor,
      borderWidth,
      borderColor,
      offset,
    } = this.props

    if (!isOpen || !anchorRect) return null

    const handlers = this.getHandlers()

    if (isOpen && typeof content !== 'function') {
      return (
        <Rect observe={isOpen}>
          {({ rect: contentRect, ref }) => {
            const fit = this.calculatePosition(anchorRect, contentRect)
            return (
              <div
                {...handlers}
                ref={ref}
                style={{
                  ...fit.styles,
                  ...this.getContentStyles(),
                }}
              >
                {content}
                {hasArrow && (
                  <Arrow
                    anchorRect={anchorRect}
                    contentRect={contentRect}
                    position={fit.position}
                    size={arrowSize}
                    color={backgroundColor}
                    borderWidth={borderWidth}
                    borderColor={borderColor}
                    offset={offset}
                  />
                )}
              </div>
            )
          }}
        </Rect>
      )
    }

    if (isContentFunction(content)) {
      return (
        <Rect observe={isOpen}>
          {({ rect: contentRect, ref }) => {
            const fit = this.calculatePosition(anchorRect, contentRect)
            return (
              <React.Fragment>
                {content({
                  isOpen,
                  getProps: () => {
                    return {
                      ref,
                      ...handlers,
                      style: {
                        ...fit.style,
                        ...this.getContentStyles(),
                      },
                    }
                  }
                })}
                {hasArrow && (
                  <Arrow
                    anchorRect={anchorRect}
                    contentRect={contentRect}
                    position={fit.position}
                    size={arrowSize}
                    color={backgroundColor}
                    borderWidth={borderWidth}
                    borderColor={borderColor}
                    offset={offset}
                  />
                )}
              </React.Fragment>
            )
          }}
        </Rect>
      )
    }

    return null
  }

  getHandlers() {
    const { trigger } = this.props
    let handlers = {}

    if (trigger.includes('hover')) {
      handlers["onMouseEnter"] = this.onMouseEnter
      handlers["onMouseLeave"] = this.onMouseLeave
    }

    if (trigger.includes('click')) {
      handlers["onClick"] = this.onClick
    }

    return handlers
  }

  renderChildren(ref: Ref, rect: DOMRect): React.ReactNode {
    const { children } = this.props

    const handlers = this.getHandlers()

    if (isChildFunction(children)) {
      return children({
        ref,
        toggleIsOpen: this.toggleIsOpen,
        ...handlers,
      })
    }

    return (
      <div
        ref={ref}
        {...handlers}
      >
        {children}
      </div>
    )
  }

  render() {
    const { isOpen } = this.state

    return (
      <Rect observe={isOpen}>
        {({ rect, ref }) => (
          <div ref={this.rootRef}>
            {this.renderChildren(ref, rect)}
            {this.renderContent(rect)}
          </div>
        )}
      </Rect>
    )
  }
}

export default Tooltip
