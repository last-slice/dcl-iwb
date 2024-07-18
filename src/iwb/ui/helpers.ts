import { Entity, UiCanvasInformation, YGPositionType, YGUnit, engine } from "@dcl/sdk/ecs"
import { uiSizes } from "./uiConfig"
import { Color4 } from "@dcl/sdk/math"

export let dimensions:any = {
    width:0,
    height:0
  }

let timer = 0   
export function uiSizer(dt:number){
  if(timer > 0){
    timer -= dt
  }
  else{
    timer = 3
    let canvas = UiCanvasInformation.get(engine.RootEntity)
    // console.log(canvas.interactableArea)
    // console.log("CANVAS DIMENSIONS: ", canvas.width, canvas.height)
    dimensions.width = canvas.width
    dimensions.height = canvas.height
  }
}

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

export function addLineBreak(text:string, bubble:boolean | undefined, lineCount:number, large?:number){
  return lineBreak(text, lineCount)
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

  export function getUITransform(
    component: any,
    entiy: Entity,
    height = 100,
    width = 100,
    unit: YGUnit = YGUnit.YGU_PERCENT,
  ) {
    let uiTransformComponent = component.getMutableOrNull(entiy)
  
    if (!uiTransformComponent) {
      uiTransformComponent = component.create(entiy)
      uiTransformComponent.heightUnit = unit
      uiTransformComponent.widthUnit = unit
      uiTransformComponent.height = height
      uiTransformComponent.width = width
      uiTransformComponent.maxHeightUnit = unit
      uiTransformComponent.maxWidthUnit = unit
      uiTransformComponent.maxHeight = height
      uiTransformComponent.maxWidth = width
    }
  
    if (entiy === 0) {
      uiTransformComponent.positionType = YGPositionType.YGPT_ABSOLUTE
    }
  
    return uiTransformComponent
  }

  export function getRandomColor4(alpha?:number){
    return Color4.create(Math.random(), Math.random(), Math.random(), alpha ? alpha : Math.random())
  }