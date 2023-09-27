import {
  engine,
  Transform,
  UiCanvasInformation,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { createCatalogPanel } from './CatalogPanel'
import { createNotificationPanel } from './NotificationPanel'
// import { createToolPanel } from './ToolPanel'
import { createNewScenePanel } from './CreateScenePanel'
import { createToolsPanel } from './ToolsPanel'
import { uiSizer } from './helpers'
import { createUploadConfirmPanel } from './uploadConfirmPanel'
import { createPillPanel } from './PillPanel'
import { createRectanglePanel } from './RectanglePanel'
import { createBlockPanel } from './BlockPanel'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

const uiComponent = () => [



  /**
   * TODO
   * create ui panels
   */

  createCatalogPanel(),
  createNotificationPanel(),
  // createToolPanel(),
  createNewScenePanel(),
  createToolsPanel(),

  //temp panels, this will become components called by larger UI
  createUploadConfirmPanel(),
  createPillPanel(),
  createRectanglePanel(),
  createBlockPanel()
]