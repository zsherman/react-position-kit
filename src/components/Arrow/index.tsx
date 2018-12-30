import * as React from 'react'
import { Position } from 'types'

interface IProps {
  anchorRect: DOMRect;
  contentRect: DOMRect;
  position: Position;
  size: number;
  color: string;
  borderWidth: number;
  borderColor: string;
  offset: number;
}

interface IBorderProps {
  size: number;
  position: Position;
  borderWidth: number;
  borderColor: string;
}

const arrowStyles = {
  content: "",
  height: 0,
  width: 0,
  position: 'fixed' as 'fixed',
  zIndex: 9999,
  borderStyle: 'solid',
}

const getBorderStyles = ({
  size,
  position,
  borderWidth,
  borderColor,
}: IBorderProps) => {

  const baseStyles = {
    borderWidth: size + borderWidth,
    zIndex: 9998,
  }

  switch (position) {
    case 'top':
      return {
        ...baseStyles,
        marginLeft: -borderWidth,
        borderColor: `${borderColor} transparent transparent transparent`,
      }
    case 'right':
      return {
        ...baseStyles,
        marginTop: -borderWidth,
        marginLeft: -(borderWidth * 2),
        borderColor: `transparent ${borderColor} transparent transparent`,
      }
    case 'bottom':
      return {
        ...baseStyles,
        marginLeft: -borderWidth,
        marginTop: -(borderWidth * 2),
        borderColor: `transparent transparent ${borderColor} transparent`,
      }
    case 'left':
      return {
        ...baseStyles,
        marginTop: -borderWidth,
        borderColor: `transparent transparent transparent ${borderColor}`,
      }
    default:
      return baseStyles
  }
}

const getPositionStyles = ({
  position,
  size,
  color,
  contentRect,
  anchorRect,
  borderWidth,
  offset,
}: IProps): React.CSSProperties => {
  const baseStyles = {
    borderWidth: size,
    borderColor: 'transparent',
  }

  if (!contentRect) return baseStyles

  switch(position) {
    case 'top':
      return {
        ...baseStyles,
        borderColor: `${color} transparent transparent transparent`,
        left: anchorRect.left + ((anchorRect.width / 2) - size),
        top: contentRect.top + contentRect.height - borderWidth,
      }
    case 'right':
      return {
        ...baseStyles,
        borderColor: `transparent ${color} transparent transparent`,
        left: contentRect.left - (size * 2) + borderWidth,
        top: anchorRect.top + ((anchorRect.height / 2) - size),
      }
    case 'bottom':
      return {
        ...baseStyles,
        borderColor: `transparent transparent ${color} transparent`,
        left: anchorRect.left + ((anchorRect.width / 2) - size),
        top: contentRect.top - (size * 2) + borderWidth,
      }
    case 'left':
      return {
        ...baseStyles,
        borderColor: `transparent transparent transparent ${color}`,
        left: contentRect.left + contentRect.width - borderWidth,
        top: anchorRect.top + ((anchorRect.height / 2) - size),
      }
    default:
      return {
        ...baseStyles,
        borderTop: `${size}px solid ${color}`,
      }
  }
}

const Arrow: React.StatelessComponent<IProps> = ({
  anchorRect,
  contentRect,
  color,
  size,
  position,
  borderWidth,
  borderColor,
  offset,
}) => {
  const positionStyles = getPositionStyles({
    color,
    size,
    position,
    contentRect,
    anchorRect,
    borderWidth,
    borderColor,
    offset,
  })

  return (
    <div>
      <div
        style={{
          ...arrowStyles,
          ...positionStyles,
        }}
      />
      <div style={{
        ...arrowStyles,
        ...positionStyles,
        ...getBorderStyles({
          size,
          position,
          borderWidth,
          borderColor,
        }),
      }} />
    </div>
  )
}

export default Arrow
