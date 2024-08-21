import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { sizeFont } from '../../../helpers'
import { getActionList, newActionData, newActionIndex, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { sceneEdit } from '../../../../modes/Build'

export function AddFollowPathPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::follow::path::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: 'auto',
        }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Choose Path", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '70%',
        }}
    >
        <Dropdown
        options={getScenePaths().map(($)=> $.label)}
        selectedIndex={0}
        onChange={selectPath}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}//
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
        </UiEntity>
    </UiEntity>
    )
}

function getScenePaths(){
    if(getActionList()[newActionIndex] !== Actions.FOLLOW_PATH.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())){
        return []
    }

    if(!sceneEdit){
        return []
    }

    let paths:any[] = []
    sceneEdit[COMPONENT_TYPES.PATH_COMPONENT].forEach((pathInfo:any, aid:string)=>{
        let name = sceneEdit[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
        paths.push({label: name.value, aid:aid})
    })
    paths.sort((a:any,b:any) => a.localeCompare(b))
    paths.unshift({label:"Select Path", aid:""})
    return paths
}

function selectPath(index:number){
    updateActionData({pathAid: getScenePaths()[index].aid}, true)
}

//