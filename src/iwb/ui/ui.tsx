import {
  engine,
  Transform,
  UiCanvasInformation,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { uiSizer } from './helpers'
import { createIWBMap } from './Objects/Map'
import { createToolsPanel } from './Objects/ToolIcons'
import { createSkinnyVerticalPanel } from './Reuse/SkinnyVerticalPanel'
import { createMainView } from './Objects/IWBView'
import { IWBButton } from './Reuse/IWBButton'
import { createStoreview } from './Objects/StoreView'
import { createCatalogPanel, displayCatalogPanel } from './Objects/CatalogPanel'
import { createCatalogInfoPanel, displayCatalogInfoPanel } from './Objects/CatalogInfoPanel'
import { createCustomContextMenu } from './Objects/ContextMenu'
import { createNotificationUI } from './Objects/NotificationPanel'
import { createSceneInfoPanel, displaySceneAssetInfoPanel } from './Objects/SceneInfoPanel'
import { createEditAssetPanel } from './Objects/EditAssetPanel'
import { createShowTextComponent } from './Objects/ShowText'
import { createExpandedMapView } from './Objects/ExpandedMapView'
import { createSceneDetailsPanel } from './Objects/SceneMainDetailPanel'
import { createPendingStatusPanel } from './Objects/PendingInfoPanel'
import { createCustomUITextComponent } from './Objects/createCustomUITextComponent'
import { createCustomUIImageComponent } from './Objects/UIImage'
import { createAddSpawnPointPanel } from './Objects/AddSpawnPointPanel'
import { createGrabContextMenu } from './Objects/GrabContextMenu'
import { createEndGameButton, createGameStartUI, createLoadingScreen } from './Objects/GameStartUI'
import { createLiveUI } from './Objects/LiveShowPanel'
import { createGameLobbyPanel } from './Objects/GameLobby'
import { createDialogPanel } from './Objects/DialogPanel'
import { createTutorialVideoButton } from './Objects/TutorialVideo'
import { createMainLoadingScreen } from './Objects/LoadingScreen'
import { createQuestPanel } from './Objects/QuestPanel'
import { createUITests } from './tests'

export function setupUI() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
    engine.addSystem(uiSizer)
}

export let uiInput:boolean = false
export function setUIClicked(value:boolean){
    uiInput = value
}

const uiComponent:any = () => [
  createCustomUIImageComponent(),
  createCustomUITextComponent(),
  createIWBMap(),
  createToolsPanel(),
  createSkinnyVerticalPanel(),
  createMainView(),
  createStoreview(),
  createCatalogPanel(),
  createCatalogInfoPanel(),
  createCustomContextMenu(),
  createNotificationUI(),
  createSceneInfoPanel(),
  createEditAssetPanel(),
  createShowTextComponent(),
  createExpandedMapView(),
  createSceneDetailsPanel(),
  createPendingStatusPanel(),
  createAddSpawnPointPanel(),
  createGrabContextMenu(),
  createGameStartUI(),
  createEndGameButton(),
  createLoadingScreen(),
  createLiveUI(),
  createGameLobbyPanel(),
  createDialogPanel(),
  createTutorialVideoButton(),
  createMainLoadingScreen(),
  createQuestPanel(),
  // createAdvancedEditPanel(),


  // createUITests(),//
]

export function generateButtons(data:any){
  let arr:any[] = []
  data.buttons.forEach((button:any)=>{
      arr.push(<IWBButton button={button} buttons={data.buttons} />)
  })
  return arr
}

export function hideAllPanels(){
  // displaySceneInfoPanel(false, null)
  displayCatalogInfoPanel(false)
  // displaySettingsPanel(false)
  // displayAssetUploadUI(false)
  displaySceneAssetInfoPanel(false)
  displayCatalogPanel(false)
}
