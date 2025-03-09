import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'
import { selectedItem } from '../../StoreView'

let counterVariables:any[] = [] 
let isVar:boolean = false
let counterVariable:string = ""

export function updateSubractNumberPanel(){
    counterVariables.length = 0
    isVar = false

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene)  return;

    scene[COMPONENT_TYPES.COUNTER_COMPONENT].forEach((number:any, aid:string)=>{
        counterVariables.push({aid:aid, name: scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value})
    })

    counterVariables.unshift({name:"SELECT VARIABLE", aid:""})
}

export function AddSubtractNumberActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::number::subtract::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
                                    selectedIndex={0}
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
                                    selectedIndex={0}
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
            height: '10%',
            margin:{bottom:'5%'},
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
            height: '50%',
                display: isVar ? "none" : "flex"
        }}
    >
        <Input
            onChange={(value) => {
                updateActionData({value:  parseFloat(value.trim())}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'0'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
        </UiEntity>
    </UiEntity>
    )
}