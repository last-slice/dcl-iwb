import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions } from '../../../../helpers/types'
import { getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let selectedType:number = 0

let editData:any = undefined
export function updateActionTeleportPlayer(data?:any){
    if(data){
        editData = data
        selectedType = data.ttype
    }
}

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
            selectedIndex={selectedType}
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
                    height: '20%',
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

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"X", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />
                    
                    <Input
                        onChange={(value) => {
                            updateActionData({x: parseInt(value.trim())}, true)
                        }}
                        onSubmit={(value) => {
                            updateActionData({x: parseInt(value.trim())}, true)
                        }}
                        fontSize={sizeFont(20,15)}
                        placeholder={editData ? "" + editData.x : 'X Parcel'}
                        placeholderColor={Color4.White()}
                        color={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '90%',
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


<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Y", textAlign:'middle-left', fontSize:sizeFont(20,15)}}//
        />

            <Input
            onChange={(value) => {
                updateActionData({y: parseInt(value.trim())}, true)
            }}
            onSubmit={(value) => {
                updateActionData({y: parseInt(value.trim())}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? "" + editData.y : 'Y Parcel'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '90%',
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
                height: '50%',
                 display :selectedType === 1 ? "flex" : "none"
            }}
        >
    
    <Input
        onChange={(value) => {
            let input = value.trim()
            if(!input.includes(".dcl.eth")){
                input += ".dcl.eth"
            }
            updateActionData({text: input}, true)
        }}
        onSubmit={(value) => {
            let input = value.trim()
            if(!input.includes(".dcl.eth")){
                input += ".dcl.eth"
            }
            updateActionData({text: input}, true)
        }}
        fontSize={sizeFont(20,15)}
        placeholder={editData ? "" + editData.text : 'DCL ENS'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '50%',
            margin:{bottom:"5%"}
        }}
        ></Input>

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"Format DCL Name as either:", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"dclbuilder", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"dclbuilder.dcl.eth", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />


            </UiEntity>


            {/* custom world type */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
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
                        placeholder={editData ? "" + editData.url : 'Custom Server URL'}
                        placeholderColor={Color4.White()}
                        color={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '80%',
                            margin:{bottom:"5%"}
                        }}
                        ></Input>

                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"Format Custom URL as below:", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"https://customdomain/world/dclname", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"5%"}
                }}
                uiText={{value:"Example:", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                uiText={{value:"https://worlds.dcl-iwb.co/world/dclbuilder.dcl.eth", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
                />

        </UiEntity>

    </UiEntity>
    )
}
