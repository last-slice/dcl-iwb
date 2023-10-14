import {
  engine,
  Transform,
  UiCanvasInformation,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { createCatalogPanel } from './Panels/CatalogPanel'
import { createNotificationPanel } from './Panels/NotificationPanel'
// import { createToolPanel } from './ToolPanel'
import { createNewScenePanel } from './Panels/CreateScenePanel'
import { createToolsPanel } from './Panels/ToolsPanel'
import { uiSizer } from './helpers'
import { createUploadConfirmPanel } from './Panels/uploadConfirmPanel'
import { createRectanglePanel } from './Panels/RectanglePanel'
import { createBlockPanel } from './Panels/BlockPanel'
import { createAssetUploadUI } from './Panels/assetUploadUI'
import { createNotificationUI } from './Panels/notificationUI'
import { createNoWeb3Panel } from './Panels/noWeb3Panel'
import { createFTPPanel } from './Panels/ftPlayerPanel'
import { createRPPPanel } from './Panels/rpPlayerPanel'
import { createSaveBuildPanel } from './Panels/saveBuildPanel'
import { createLoadBuildPanel } from './Panels/loadBuildPanel'
import { createInfoPanel } from './Panels/infoPanel'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

const uiComponent = () => [



  /**
   * TODO
   * create ui panels
   */

  createNoWeb3Panel(),
  createInfoPanel(),
  createNotificationUI(),
  createCatalogPanel(),
  createNotificationPanel(),
  createFTPPanel(),
  createRPPPanel(),
  createSaveBuildPanel(),
  createLoadBuildPanel(),
  createNewScenePanel(),
  createToolsPanel(),

  //temp panels, this will become components called by larger UI
  createUploadConfirmPanel(),
  // createPillPanel(),
  createRectanglePanel(),
  createBlockPanel(),
  createAssetUploadUI()
]