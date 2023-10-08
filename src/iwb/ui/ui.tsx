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
import { createRectanglePanel } from './RectanglePanel'
import { createBlockPanel } from './BlockPanel'
import { createAssetUploadUI } from './assetUploadUI'
import { createNotificationUI } from './notificationUI'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

const uiComponent = () => [



  /**
   * TODO
   * create ui panels
   */

  createNotificationUI(),
  createCatalogPanel(),
  createNotificationPanel(),
  // createToolPanel(),
  createNewScenePanel(),
  createToolsPanel(),

  //temp panels, this will become components called by larger UI
  createUploadConfirmPanel(),
  // createPillPanel(),
  createRectanglePanel(),
  createBlockPanel(),
  createAssetUploadUI()
]