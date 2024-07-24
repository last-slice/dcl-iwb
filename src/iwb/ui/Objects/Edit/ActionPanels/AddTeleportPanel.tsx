import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions } from '../../../../helpers/types'
import { getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let selectedType:number = 0

export function resetTeleportPanel(){
    selectedType = 0
    updateActionData({type:"gc"}, true)
}

export function AddTeleport(){
    return(
        <UiEntity
        key={resources.slug + "action::teleport::panel"}
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
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Choose Teleport Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:'5%'}
            }}
            >

        <Dropdown
            options={['Genesis City', "DCL World Server", 'Custom World Server']}
            selectedIndex={0}
            onChange={(index:number)=>{
                selectedType = index
                updateActionData({ttype:index}, true)
            }}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
        </UiEntity>

            {/* genesis city type */}
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    display :selectedType === 0 ? "flex" : "none"
                }}
            >

            <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50%',
                                height: '100%',
                            }}
                        >
                    
                    <Input
                        onChange={(value) => {
                            updateActionData({x: parseInt(value.trim())}, true)
                        }}
                        fontSize={sizeFont(20,15)}
                        placeholder={'X Parcel'}
                        placeholderColor={Color4.White()}
                        color={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '80%',
                        }}
                        ></Input>
            </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
            >

            <Input
            onChange={(value) => {
                updateActionData({y: parseInt(value.trim())}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Y Parcel'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '80%',//
            }}
            ></Input>
                </UiEntity>

        </UiEntity>

        {/* dcl world realm */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                 display :selectedType === 1 ? "flex" : "none"
            }}
        >
    
    <Input
        onChange={(value) => {
            updateActionData({text: value.trim()}, true)
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'DCL ENS'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '80%',
        }}
        ></Input>
            </UiEntity>

            {/* custom world type */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    display :selectedType === 2 ? "flex" : "none"
                }}
            >
                    <Input
                        onChange={(value) => {
                            updateActionData({url: value.trim()}, true)
                        }}
                        onSubmit={(value) => {
                            updateActionData({url: value.trim()}, true)
                        }}
                        fontSize={sizeFont(20,15)}
                        placeholder={'Custom Server URL'}
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
