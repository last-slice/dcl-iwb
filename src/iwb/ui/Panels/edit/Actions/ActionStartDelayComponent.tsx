import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { localPlayer } from '../../../../components/player/player'

export let actionNames:string[] = []
export let actionIds:string[] = []
export let actionLabels:any[] = []


export let selectedActionIndex:number = 0
export let startDelayAction:any = {
    timer:0,
    id: actionIds[selectedActionIndex]
}

export function updateDelayActions(){
    actionNames.length = 0
    actionIds.length = 0
    actionLabels.length = 0
    if(localPlayer.activeScene){
        localPlayer.activeScene.ass.forEach((asset)=>{
            if(asset.actComp){
                asset.actComp.actions.forEach((action:any, key:any)=>{
                    actionNames.push(action.name)
                    actionIds.push(key)
                    actionLabels.push(action.type)
                })
            }
        })
    }
    startDelayAction.id = actionIds[selectedActionIndex]
}

export function ActionStartDelayComponent(){
    return(
        <UiEntity
        key={'actionstartdelaycomponent'}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
        // uiBackground={{color:Color4.Green()}}
    >


            {/* first row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '35%',
            display:'flex',
        }}
    >


        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                    display:'flex'
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Delay in Seconds", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '60%',
                    display:'flex'
                }}
            >


            <Input  
            onChange={(value) => {
                startDelayAction.timer = parseInt(value)
            }}
            fontSize={sizeFont(18,12)}
            placeholder={''}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
            </UiEntity>

         </UiEntity>

         <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                    display:'flex'
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '33%',
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Action", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '60%',
                    display:'flex'
                }}
            >

                        <Dropdown
                    key={"action-start-delay-dropdown"}
                    options={actionNames}
                    selectedIndex={selectedActionIndex}
                    onChange={(e)=>{
                        selectedActionIndex = e
                        startDelayAction.id = actionIds[selectedActionIndex]
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(18, 12)}
                />

            </UiEntity>

         </UiEntity>



        </UiEntity>

        </UiEntity>


                  
    )
}