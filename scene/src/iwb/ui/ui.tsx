import {
  engine,
  Transform,
  UiCanvasInformation,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export let dimensions:any = {
  width:0,
  height:0
}

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

const uiComponent = () => [

  /**
   * TODO
   * create ui panels
   */
  
]



let timer = 0   
function uiSizer(dt:number){
  if(timer > 0){
    timer -= dt
  }
  else{
    timer = 3
    let canvas = UiCanvasInformation.get(engine.RootEntity)
    console.log("CANVAS DIMENSIONS: ", canvas.width, canvas.height)
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

export function addLineBreak(text:string, bubble?:boolean, lineCount?:number){
  return lineBreak(text,lineCount ? lineCount : 20)
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