import * as React from "react";
import { Position } from "types";

type InteractionEvent = MouseEvent | TouchEvent;
type InteractionHandler = (e: InteractionEvent) => void;

interface IFit {
  style: React.CSSProperties;
  position: Position;
}

// Placement configuration used to calculate coordinates for positioning and alignment
const placementsByPosition = {
  top: {
    alignmentStart: "left",
    alignmentDimension: "width",
    positionDimension: "height",
    positionFromEnd: false,
    positionStart: "top"
  },
  right: {
    alignmentStart: "top",
    alignmentDimension: "height",
    positionDimension: "width",
    positionFromEnd: true,
    positionStart: "left"
  },
  bottom: {
    alignmentStart: "left",
    alignmentDimension: "width",
    positionDimension: "height",
    positionFromEnd: true,
    positionStart: "top"
  },
  left: {
    alignmentStart: "top",
    alignmentDimension: "height",
    positionDimension: "width",
    positionFromEnd: false,
    positionStart: "left"
  }
};

// Base styles to apply to all content containers
function getBaseStyles(): React.CSSProperties {
  return {
    visibility: "visible",
    position: "fixed"
  };
}

// Measure the position and alignment for each placement of a given content rect
export function measureFitStyles({
  position,
  alignment,
  anchorRect,
  contentRect,
  offset,
  hasArrow,
  arrowSize
}: any): React.CSSProperties {
  // If the content rect hasn't been measured yet don't add positioning styles
  if (!contentRect) return getBaseStyles();

  // Get placement configuration
  const placement = placementsByPosition[position as Position];

  // Starting position for the anchor, value in px of the position start
  const anchorPosition: number = anchorRect[placement.positionStart];

  // Get the relevant dimensions for the anchor and content recs
  const anchorDimensionSize: number = anchorRect[placement.positionDimension];
  const contentDimensionSize: number = contentRect[placement.positionDimension];

  // Initialize the content position to the anchor start minus content position offset
  let contentPosition: number = anchorPosition - contentDimensionSize;

  // Depending on the placement config, either push or pull the content rect
  if (placement.positionFromEnd) {
    contentPosition = anchorPosition + anchorDimensionSize;
  }

  // Account for offset from the anchor element
  const contentPositionWithOffset: number = placement.positionFromEnd
    ? contentPosition + offset
    : contentPosition - offset;

  // Alignment start for the anchor rect
  const anchorAlignment: number = anchorRect[placement.alignmentStart];

  // Alignment value for the content rect, defaults to anchor alignment start
  let contentAlignment: number = anchorAlignment;

  // TODO use alignment enum
  if (alignment === "start") {
    contentAlignment = anchorAlignment;
    // Account for arrow placement
    contentAlignment = hasArrow
      ? contentAlignment - arrowSize
      : contentAlignment;
  }

  if (alignment === "middle") {
    const difference =
      anchorRect[placement.alignmentDimension] -
      contentRect[placement.alignmentDimension];
    contentAlignment = anchorRect[placement.alignmentStart] + difference / 2;
  }

  if (alignment === "end") {
    contentAlignment =
      anchorAlignment +
      anchorRect[placement.alignmentDimension] -
      contentRect[placement.alignmentDimension];
    // Account for arrow placement
    contentAlignment = hasArrow
      ? contentAlignment + arrowSize
      : contentAlignment;
  }

  const coords = {
    [placement.positionStart]: contentPositionWithOffset,
    [placement.alignmentStart]: contentAlignment
  };

  return coords;
}

function rankFits(fits: any) {
  return fits.filter((f: any) => f);
}

export function fitOnBestSide({
  positions,
  alignment,
  anchorRect,
  contentRect,
  offset,
  hasArrow,
  arrowSize
}: any): IFit {
  const fits = positions.map((position: any) => ({
    position,
    style: measureFitStyles({
      position,
      alignment,
      anchorRect,
      contentRect,
      offset,
      hasArrow,
      arrowSize
    })
  }));

  const rankings = rankFits(fits);
  const baseStyles = getBaseStyles();

  return {
    position: rankings[0].position,
    style: {
      ...baseStyles,
      ...rankings[0].style
    }
  };
}

export function uniq(v: string, i: number, self: Array<string>) {
  return self.indexOf(v) === i;
}

export function createEventHandler(
  shouldOpen: boolean,
  toggleIsOpen: (isOpen?: boolean) => void,
  handler?: InteractionHandler
) {
  return (e: InteractionEvent): any => {
    if (handler) handler(e);
    toggleIsOpen(shouldOpen);
  };
}
