import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {visibleComponent} from './EditObjectDataPanel'
import {COMPONENT_TYPES, EDIT_MODES, NOTIFICATION_TYPES, REWARD_TYPES, SERVER_MESSAGE_TYPES} from '../../../helpers/types'
import {sendServerMessage} from '../../../components/messaging'
import {selectedItem} from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { showNotification } from '../notificationUI'

let reward:any ={
    start:0,
    end:0,
    ip:0,
    amt:0,
    key:"",
    type:"dcl_item"
}

let rewardLabels:any[] = [...Object.values(REWARD_TYPES)]


export function updateRewardInfo(info:any){
    console.log('info is', info)
    reward = {...info}//
    rewardLabels.forEach((label)=>{
        label.replace("_", " ")
    })
}

export function RewardComponentPanel() {
    return (
        <UiEntity
            key={"iwbrewardcomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.REWARD_COMPONENT ? 'flex' : 'none',
            }}
        >

    {/* start time */}
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
                        value: "Start Time (timestamp in ms)",
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
                        placeholder={"" + getObject("start")}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.start = Math.floor(parseInt(input))
                        }}
                        value={"" + getObject("start")}

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
                        value: "End Time (timestamp in ms)",
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
                        placeholder={"" + getObject("end")}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.end = Math.floor(parseInt(input))
                        }}
                        value={"" + getObject("end")}

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
                        placeholder={"" + getObject("ip")}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.ip = Math.floor(parseInt(input))
                        }}
                        value={"" + getObject("ip")}

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
                        placeholder={"" + getObject("amt")}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                        textAlign='middle-center'
                        onChange={(input) => {
                            reward.amt = Math.floor(parseInt(input))
                        }}
                        value={"" + getObject("amt")}

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
                            reward.key = input.trim()//
                        }}
                    />

                </UiEntity>

            </UiEntity>

                    {/* reward type dropdown */}
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
                        value: "Reward Type",
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
                        <Dropdown
                    key={"reward-type-dropdown"}
                    options={rewardLabels}
                    selectedIndex={0}
                    onChange={selectRewardType}
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

            {/* update button row */}
           <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent:'flex-start',
                alignItems:'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
            >

             <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    margin: {left: "1%", right: "1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    updateReward()
                }}
            />

</UiEntity>

        </UiEntity>
    )
}
function selectRewardType(index:number){
    reward.type = [...Object.values(REWARD_TYPES)][index]
}

function getObject(object:any){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.rComp ? selectedItem.itemData.rComp[object] : ""
}

function updateReward(){
    if(isNaN(reward.start) || isNaN(reward.end) || isNaN(reward.ip) || isNaN(reward.amt)){
        return
    }
    sendServerMessage(
        SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, 
        {
            component:COMPONENT_TYPES.REWARD_COMPONENT, 
            action:"update", 
            data:{
                aid:selectedItem.aid, 
                sceneId:selectedItem.sceneId, 
                type:"update", 
                value:reward
            }
        }
    )
}