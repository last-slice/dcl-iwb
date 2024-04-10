import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { formatDollarAmount, formatSize, log } from '../../../helpers/functions'
import { buildInfoTab, scene } from './buildsIndex'
import { cRoom, sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import {PositionUnit} from "@dcl/react-ecs/dist/components/uiTransform/types";

let visibleIndex = 0
let visibleItems:any[] = []
let addWallet:string = ""

export function showAllAccess(){
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems.length = 0

    worlds.sort((a, b) => a.name.localeCompare(b.name));
  
    for(let i = (visibleIndex * 6); i < (worlds.length < 6 ? worlds.length : (visibleIndex * 6) + 6); i++){
      visibleItems.push(worlds[i])
      }
  
      let top = (visibleIndex * 6) + 6
      if(top > visibleItems.length && visibleItems.length === 6){
          for(let i = 0; i < (top - visibleItems.length); i++){
              visibleItems.pop()
          }
      }
  }

export function SizePanel() {
    return (
        <UiEntity
            key={"buildsizepanel"}
            uiTransform={{
                display: buildInfoTab === "Size" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Size Limits", color:Color4.White(), fontSize:sizeFont(30,25)}}
            />

            {/* Poly count size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Poly Count: " + (scene && scene !== null ? formatDollarAmount(scene.pc) + " / " + formatDollarAmount(scene.pcls.length * 10000) : "") , color:Color4.White(), fontSize:sizeFont(25,16)}}
            />

            {/* Poly count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* Poly count size  */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: getPolyWidth(),
                height: '100%',
            }}
            uiBackground={{color: scene?.pc && (scene.pc / (scene.pcls.length * 10000)) > 0.75 ? Color4.Red() : Color4.Green()}}/>

            </UiEntity>


            {/* file size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{
                value: scene ? `Scene File Size: ${parseFloat(formatSize(scene.si))} MB / ${scene.pcnt > 12 ? 300 : scene.pcnt * 15} MB` : "",
                color: Color4.White(),
                fontSize: sizeFont(25,16)
            }}

            />

            {/* File count size container */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: getSizeWidth(),
                height: '100%',
            }}
            uiBackground={{color:  scene && scene !== null ? (parseFloat(formatSize(scene.si)) / (scene.pcnt > 20 ? 300 : scene.pcnt * 15)) > 0.75 ? Color4.Red() : Color4.Green()  : Color4.Green()}}
            />

            </UiEntity>
        
        </UiEntity>
    )
}

function getPolyWidth(): PositionUnit | undefined {
    return scene ? `${Math.min((scene.pc / (scene.pcls.length * 10000)) * 100, 100)}%` : '0%';
}
function getSizeWidth():  PositionUnit | undefined {
    if (!scene) return '0%';
    const sizeRatio = parseFloat(formatSize(scene.si)) / (scene.pcnt > 20 ? 300 : scene.pcnt * 15) * 100;
    return `${Math.min(sizeRatio, 100)}%`;
}