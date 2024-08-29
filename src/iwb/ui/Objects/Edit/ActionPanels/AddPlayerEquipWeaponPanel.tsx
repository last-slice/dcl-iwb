import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { sceneEdit } from '../../../../modes/Build'
import { COMPONENT_TYPES } from '../../../../helpers/types'

let sceneWeapons:any[] = []

export function updateSceneWeapons(){
    sceneWeapons.length = 0
    if(sceneEdit){
        sceneEdit[COMPONENT_TYPES.GAME_ITEM_COMPONENT].forEach((gameItem:any, aid:string)=>{
            if(gameItem.type === 0){
                sceneWeapons.push({name: sceneEdit[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value, aid:aid})
            }
        })
        sceneWeapons.sort((a,b) => a.name.localeCompare(b))
        sceneWeapons.unshift({name:"SELECT WEAPON", aid:""})
    }
}

export function AddPlayerEquipWeaponPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::player::equip::weapon::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Choose Weapon", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'1%'}
        }}
    >
        <Dropdown
        options={sceneWeapons.map($=> $.name)}
        selectedIndex={0}
        onChange={(index:number)=>{
            updateActionData({game:sceneWeapons[index].aid})
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>
    </UiEntity>
    )
}