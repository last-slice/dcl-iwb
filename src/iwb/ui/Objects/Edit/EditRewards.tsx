
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { sizeFont, calculateSquareImageDimensions, getImageAtlasMapping } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'

let reward:any ={
    start:0,
    end:0,
    ip:0,
    amt:0,
    key:"",
    type:"dcl_item"
}

export function updateRewardInfo(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let rewardInfo = scene[COMPONENT_TYPES.REWARD_COMPONENT].get(selectedItem.aid)
    if(!rewardInfo){
        return
    }

    reward = rewardInfo
}

export function EditRewards() {
    return (
        <UiEntity
            key={resources.slug + "edit::rewards::panel"}
            uiTransform={{
                flexDirection: 'column',//
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.REWARD_COMPONENT ? 'flex' : 'none',
            }}
        >

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "1%"}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Start Time (timestamp in ms)\n(eg, 1722874461)",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-left'
                    }}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                >

                    <Input
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}//
                        placeholderColor={Color4.White()}
                        placeholder={"" + reward.start}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.start = Math.floor(parseInt(input.trim()))
                            update("start", reward.start)
                        }}
                        onSubmit={(input) => {
                            reward.start = Math.floor(parseInt(input.trim()))
                            update("start", reward.start)
                        }}
                        // value={"" + getObject("start")}

                    />

                </UiEntity>

</UiEntity>

        {/* end time */}
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "1%"}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "End Time (timestamp in ms)\n(eg, 1722874461)",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-left'
                    }}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                >

                    <Input
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}//
                        placeholderColor={Color4.White()}
                        placeholder={"" + reward.end}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.end = Math.floor(parseInt(input.trim()))
                            update("end", reward.end)
                        }}
                        onSubmit={(input) => {
                            reward.end = Math.floor(parseInt(input.trim()))
                            update("end", reward.end)
                        }}
                        // value={"" + getObject("end")}

                    />

                </UiEntity>

            </UiEntity>

            {/* ip limit */}
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "1%"}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Item per IP",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-left'
                    }}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                >

                    <Input
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}//
                        placeholderColor={Color4.White()}
                        placeholder={"" + reward.ip}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.ip = Math.floor(parseInt(input.trim()))
                            update("ip", reward.ip)
                        }}
                        onSubmit={(input) => {
                            reward.ip = Math.floor(parseInt(input.trim()))
                            update("ip", reward.ip)
                        }}
                        // value={"" + getObject("ip")}

                    />

                </UiEntity>

            </UiEntity>

            {/* wallet limit */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "1%"}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Item Per Wallet",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-left'
                    }}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                >

                    <Input
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}//
                        placeholderColor={Color4.White()}
                        placeholder={"" + reward.amt}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.amt = Math.floor(parseInt(input.trim()))
                            update("amt", reward.amt)
                        }}
                        onSubmit={(input) => {
                            reward.amt = Math.floor(parseInt(input.trim()))
                            update("amt", reward.amt)
                        }}
                        // value={"" + getObject("amt")}

                    />

                </UiEntity>

            </UiEntity>

            {/* campaign key */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '13%',
                    margin: {top: "1%"}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Campaign Key",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-left'
                    }}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '100%',
                    }}
                >

                    <Input
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        placeholderColor={Color4.White()}
                        placeholder={"Your key is always hidden"}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.key = input.trim()
                            update("key", reward.key)
                        }}
                        onSubmit={(input) => {
                            reward.key = input.trim()
                            update("key", reward.key)
                        }}
                    />

                </UiEntity>
     
        </UiEntity>

    </UiEntity>
    )
}

function update(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,{
        component: COMPONENT_TYPES.REWARD_COMPONENT,
        aid: selectedItem.aid, 
        sceneId: selectedItem.sceneId,
        action:"edit",
        type:type,
        value:value
    })
}