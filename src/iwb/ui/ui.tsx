import {
  engine,
  Transform,
  UiCanvasInformation,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { createCatalogPanel, displayCatalogPanel } from './Panels/CatalogPanel'
import { createNotificationPanel } from './Panels/NotificationPanel'
import { createNewScenePanel } from './Panels/CreateScenePanel'
import { createToolsPanel } from './Panels/ToolsPanel'
import { uiSizer } from './helpers'
import { createUploadConfirmPanel } from './Panels/uploadConfirmPanel'
import { createRectanglePanel } from './Panels/RectanglePanel'
import { createBlockPanel } from './Panels/BlockPanel'
import { createAssetUploadUI, displayAssetUploadUI } from './Panels/assetUploadUI'
import { createNotificationUI } from './Panels/notificationUI'
import { createNoWeb3Panel } from './Panels/noWeb3Panel'
import { createFTPPanel } from './Panels/ftPlayerPanel'
import { createRPPPanel } from './Panels/rpPlayerPanel'
import { createSaveBuildPanel } from './Panels/saveBuildPanel'
import { createLoadBuildPanel } from './Panels/loadBuildPanel'
import { createInfoPanel } from './Panels/infoPanel'
import { createDeleteBuildPanel } from './Panels/deleteBuildPanel'
import { createPBuildConfirmPanel } from './Panels/pBuildConfirmPanel'
import { createSettingsPanel, displaySettingsPanel } from './Panels/settings/settingsIndex'
import { createRealmTravelPanel } from './Panels/realmTravelPanel'
import { createDebugPanel } from './Panels/debugPanel'
import { createSceneSavedPanel } from './Panels/sceneSavedPanel'
import { createInitalizeWorldPanel } from './Panels/initaliteWorldPanel'
import { createWorldReadyPanel } from './Panels/worldReadyPanel'
import { createCatalogInfoPanel, displayCatalogInfoPanel } from './Panels/CatalogInfoPanel'
import { createScenePanel, displaySceneInfoPanel } from './Panels/builds/buildsIndex'
import { createCustomContextMenu } from './contextMenu'
import { createEditObjectPanel } from './Panels/edit/EditObjectPanel'
import { createSceneInfoPanel, displaySceneAssetInfoPanel } from './Panels/sceneInfoPanel'
import { createDownloadPendingPanel } from './Panels/downloadPendingPanel'
import { createDeployPendingPanel } from './Panels/deployConfirmationPanel'
import { createAddSpawnPointPanel } from './Panels/builds/addSpawnPointPanel'
import { createCustomUI } from '../components/custom/ui'
import { createClearScenePanel } from './Panels/clearScenePanel'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

const uiComponent = () => [
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
  createEditObjectPanel(),
  createInitalizeWorldPanel(),
  createWorldReadyPanel(),
  createScenePanel(),
  createCustomContextMenu(),
  createSceneInfoPanel(),
  createDownloadPendingPanel(),
  createDeployPendingPanel(),
  createAddSpawnPointPanel(),
  createClearScenePanel(),


  createCustomUI()
]


export function hideAllPanels(){
  displaySceneInfoPanel(false, null)
  displayCatalogPanel(false)
  displayCatalogInfoPanel(false)
  displayCatalogPanel(false)
  displaySettingsPanel(false)
  displayAssetUploadUI(false)
  displaySceneAssetInfoPanel(false)
}