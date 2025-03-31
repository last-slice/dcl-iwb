import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'
import { selectedItem } from '../../../../modes/Build'

let counterVariables:any[] = [] 
let isVar:boolean = false
let counterVariable:string = ""

let editData:any = undefined

export function updateAddSetNumberPanel(data?:any){
    counterVariables.length = 0
    isVar = false

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene)  return;

    scene[COMPONENT_TYPES.COUNTER_COMPONENT].forEach((number:any, aid:string)=>{
        counterVariables.push({aid:aid, name: scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value})
    })

    counterVariables.unshift({name:"SELECT VARIABLE", aid:""})

    if(data){
        editData = data
        if(!editData.hasOwnProperty("counter")){
            isVar = true
        }
        counterVariable = newActionData.counter
    }
}

export function AddSetNumberActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::number::set::panel"}
        uiTransform={{
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
        uiText={{value:"Number Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'2%'}
        }}
        >

             <Dropdown
                    options={["SELECT NUMBER TYPE", "CUSTOM", "VARIABLE"]}
                    selectedIndex={editData ? editData.hasOwnProperty("counter") ? 2 : 1 : 0}
                    onChange={(index:number)=>{
                        if(index == 1){
                            isVar = false
                            delete newActionData.counter
                        }

                        if(index === 2){
                            isVar = true
                            updateActionData({counter:counterVariable})
                        }
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                        />
</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            display: isVar ? "flex" : "none"
        }}
        >

             <Dropdown
                    options={[...counterVariables.map((counter:any)=> counter.name)]}
                    selectedIndex={editData ?  [...counterVariables.map((counter:any)=> counter.aid)].findIndex((c:any)=> c === counterVariable) : 0}
                    onChange={(index:number)=>{
                        if(index !== 0){
                            counterVariable = counterVariables[index].aid
                            updateActionData({counter:counterVariables[index].aid})
                        }
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                        />
</UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            display: isVar ? "none" : "flex"
        }}
        uiText={{value:"Amount", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
             display: isVar ? "none" : "flex"
        }}
    >
        <Input
            onChange={(value) => {
                updateActionData({value:  parseFloat(value.trim())}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? newActionData.value : '0'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>
    </UiEntity>
    )
}