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
import { createDeleteBuildPanel } from './Panels/deleteBuildPanel'
import { createPBuildConfirmPanel } from './Panels/pBuildConfirmPanel'
import { createSettingsPanel } from './Panels/settings/settingsIndex'
import { createRealmTravelPanel } from './Panels/realmTravelPanel'
import { createDebugPanel } from './Panels/debugPanel'
import { createSceneSavedPanel } from './Panels/sceneSavedPanel'
import { createEditObjectPanel } from './Panels/EditObjectPanel'
import { createGizmoPanel } from './GizmoPanel'
import { createInitalizeWorldPanel } from './Panels/initaliteWorldPanel'
import { createWorldReadyPanel } from './Panels/worldReadyPanel'
import { createCatalogInfoPanel } from './Panels/CatalogInfoPanel'

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
  createCatalogInfoPanel(),
  createSettingsPanel(),
  createPBuildConfirmPanel(),
  createDeleteBuildPanel(),
  createInfoPanel(),
  createNotificationUI(),
  createCatalogPanel(),
  createNotificationPanel(),
  createFTPPanel(),
  createRPPPanel(),
  createSaveBuildPanel(),
  createLoadBuildPanel(),
  //createToolPanel(),
  createNewScenePanel(),
  createToolsPanel(),
  createRealmTravelPanel(),

  //temp panels, this will become components called by larger UI
  createUploadConfirmPanel(),
  // createPillPanel(),
  createRectanglePanel(),
  createBlockPanel(),
  createAssetUploadUI(),
  createDebugPanel(),
  createSceneSavedPanel(),
  createGizmoPanel(),
  createEditObjectPanel(),
  createInitalizeWorldPanel(),
  createWorldReadyPanel(),//
]