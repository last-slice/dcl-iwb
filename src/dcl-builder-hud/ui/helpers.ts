import { UiCanvasInformation, engine } from "@dcl/sdk/ecs"
import { dimensions } from "../../iwb/ui/helpers";

export function calculateImageDimensions(width:number, aspectRatio: number): any {
  const desiredWidth = width / 100 * dimensions.width; // 40% of the screen width
  const desiredHeight = desiredWidth / aspectRatio;
  return { width: desiredWidth, height: desiredHeight };
}

export function calculateSquareImageDimensions(percentage: number): any {
  const minDimension = Math.min(dimensions.width, dimensions.height);
  const squareSize = (minDimension * percentage) / 100;

  return { width: squareSize, height: squareSize };
}

export function addLineBreak(text:string, bubble?:boolean, lineCount?:number, large?:number){
  return lineBreak(text, large? large : lineCount ? lineCount : 20)
}

function lineBreak(text: string, maxLineLength: number): string {
  const words = text.split(' ');
  let currentLine = '';
  const lines = [];

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }
  lines.push(currentLine.trim());
  return lines.join('\n');
}

export function sizeFont(large:number, small:number){
  return dimensions.width > 2000 ? large : small
}

export function getImageAtlasMapping(data?: ImageAtlasData): number[] {
    if (!data) return []
  
    const {
      atlasWidth,
      atlasHeight,
      sourceWidth,
      sourceHeight,
      sourceTop,
      sourceLeft,
    } = data
  
    return [
      sourceLeft / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
      sourceLeft / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
    ]
  }
  
  export type ImageAtlasData = {
    atlasWidth: number;
    atlasHeight: number;
    sourceWidth: number;
    sourceHeight: number;
    sourceLeft: number;
    sourceTop: number;
  };

  export function getAspect(panel:any){
      return panel.sourceWidth / panel.sourceHeight
  }