
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { Actions, COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_EMOTES_SLUGS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { AvatarShape } from '@dcl/sdk/ecs'
import { getRandomString, paginateArray } from '../../../helpers/functions'

export let npcComponentView = "main"

let tempNPC:any = {
    dName:true,
    bodyShape:0,
    name:"",
    id:"",
    type:0,
    hairColor:{r:0, g:0, b:0, a:1},
    skinColor:{r:0, g:0, b:0, a:1},
    eyeColor:{r:0, g:0, b:0, a:1},
    wearables:[]
}

let visibleItems:string[] = []
let visibleIndex:number = 1

let wearableLink:string = ""

export function updateNPCView(v:string){
    npcComponentView = v

    if(v==="main"){
        tempNPC = selectedItem.itemData.npcComp

        !tempNPC.hairColor ? tempNPC.hairColor = {r:0, g:0, b:0, a:1} : null
        !tempNPC.skinColor ? tempNPC.skinColor = {r:0, g:0, b:0, a:1} : null
        !tempNPC.eyeColor ? tempNPC.eyeColor = {r:0, g:0, b:0, a:1} : null
        !tempNPC.wearables ? tempNPC.wearables = [] : null
    }
}

export function refreshWearables(){
    let wearables:any[] = selectedItem && selectedItem.enabled && selectedItem.itemData.npcComp ? [...selectedItem.itemData.npcComp.wearables] : []

    visibleItems = paginateArray([...wearables], visibleIndex, 3)
}

export function NPCComponent() {
    return (
        <UiEntity
            key={"editnpccomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.NPC_COMPONENT ? 'flex' : 'none',
            }}
        >

                {/* main ui panel */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        display: npcComponentView === "main" ? "flex" : "none"
                    }}
                    >  

        {/* first row */}
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '49%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"NPC Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
            >

        <Input
                onChange={(value)=>{
                    tempNPC.name = value
                }}
                fontSize={sizeFont(20,12)}
                value={tempNPC.name}
                placeholder={'link'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '120',
                }}
                ></Input>

            </UiEntity>


                </UiEntity>



                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '49%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"Display NPC Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(3).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: tempNPC.dName ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    tempNPC.dName = !tempNPC.dName
                }}
                />


            </UiEntity>


                </UiEntity>


                </UiEntity>


                {/* second row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '49%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"NPC Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
            >

        <Dropdown
                key={"npc-type-dropdown"}
                options={["Avatar"]}//, "Custom"]}
                selectedIndex={tempNPC.type}
                onChange={selectNPCType}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>


                </UiEntity>



                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '49%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"NPC Body Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
            >
            <Dropdown
                key={"npc-bodyShape-dropdown"}
                options={["Male", "Female"]}
                selectedIndex={tempNPC.bodyShape}
                onChange={selectNPCbodyShape}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>


                </UiEntity>


                </UiEntity>


                {/* hair color row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            uiText={{value:"Hair Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />


                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"R Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.hairColor.r = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.hairColor.r}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"G Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.hairColor.g = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.hairColor.g}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"B Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.hairColor.b = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                value={"" + tempNPC.hairColor.b}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                </UiEntity>


                {/* skin color row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            uiText={{value:"Skin Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />


                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"R Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.skinColor.r = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.skinColor.r}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"G Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.skinColor.g = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.skinColor.g}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"B Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.skinColor.b = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                value={"" + tempNPC.skinColor.b}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                </UiEntity>


                {/* eye color row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            uiText={{value:"Eye Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />


                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"R Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.eyeColor.r = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.eyeColor.r}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"G Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.eyeColor.g = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                    value={"" + tempNPC.eyeColor.g}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
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
                    margin:{bottom:'5%'}
                }}
            uiText={{value:"B Value", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

            <Input
                    onChange={(value)=>{
                        tempNPC.eyeColor.b = parseInt(value)
                    }}
                    fontSize={sizeFont(20,12)}
                value={"" + tempNPC.eyeColor.b}
                    placeholder={''}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    ></Input>

                </UiEntity>


                </UiEntity>

                </UiEntity>




                {/* last row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    display:'flex'
                }}
            >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                            height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
                            margin:{left:"1%", right:'1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{value: "Wearables", fontSize: sizeFont(25, 18)}}
                    onMouseDown={() => {
                        console.log('temp is', tempNPC)
                        refreshWearables()
                        updateNPCView('wMain')
                    }}
                />
{/* 
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                            height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
                            margin:{left:"1%", right:'1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{value: "Emote", fontSize: sizeFont(25, 18)}}
                    onMouseDown={() => {
                    }}
                /> */}

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
                        margin:{left:"1%", right:'1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{value: "Update", fontSize: sizeFont(25, 18)}}
                    onMouseDown={() => {
                        // updateNPC()
                        updateWearables("update", tempNPC)
                    }}
                />
                </UiEntity>

                </UiEntity>


                {/* wearables panel */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: npcComponentView === "wMain" ? "flex" : "none"
            }}
            >  

        {/* add wearable row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
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
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Wearable", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateNPCView('wAdd')
        }}
    />

        </UiEntity>


            {/* wearables rows */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '60%',
                display: npcComponentView === "wMain" ? "flex" : "none"
            }}
            >   
            {generateWearableRows()}
            </UiEntity>

        {/* paginate buttons column */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                width: '100%',
                height: '20%',
            }}
            >

                                {/* scroll up button */}
                                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                        margin: {left: "5%"},
                    }}
                    // uiBackground={{color:Color4.White()}}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                    }}
                    onMouseDown={() => {
                        if(visibleIndex -1 >= 1){
                            visibleIndex -=1
                            refreshWearables()
                        }
                    }}
                />

                {/* scroll down button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                    }}
                    onMouseDown={() => {
                        visibleIndex++
                        refreshWearables()
                    }}
                />


            </UiEntity>


            </UiEntity>

                {/* add wearables panel */}
              <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: npcComponentView === "wAdd" ? "flex" : "none"
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
            uiText={{value:"Copy Wearable Url", fontSize:sizeFont(25,18), color:Color4.White()}}
            />

        <Input
        onChange={(value)=>{
            wearableLink = value
        }}
        fontSize={sizeFont(20,12)}
        value={wearableLink}
        placeholder={'marketplace url'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '90%',
            height: '10%',
        }}
        ></Input>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                    height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Add", fontSize: sizeFont(25, 18)}}
            onMouseDown={() => {
                addWearable()
            }}
        />

            </UiEntity>
     
        </UiEntity>
    )
}

function generateWearableRows(){
    let arr:any[] = []
    let count = 0
    
    visibleItems.forEach((wearable:string, i:number)=>{
        arr.push(<WearableRow data={wearable} rowCount={count} />)
        count++
    })

    // for(let i = 0; i < 3; i++){
    //     arr.push(<WearableRow rowCount={count} />)
    //     count++
    // }

    return arr
}

function WearableRow(action:any){
    let data = action.data
    let row = action.rowCount
    return(
        <UiEntity
        key={"wearable-npc-row-"+ row}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{top:"1%", bottom:'1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
            >  

            {/* wearable image column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '80%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width:  calculateSquareImageDimensions(7).width,
                    height: calculateSquareImageDimensions(8).height
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: '' + "https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:" + data + "/thumbnail"
                    },
                }}
                />

            </UiEntity>


            {/* wearable column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            >

            {/* <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            uiText={{value:"Wearable name", fontSize:sizeFont(20,15), color:Color4.White()}}
            /> */}

            </UiEntity>

            {/* delete wearable button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getImageAtlasMapping(uiSizes.trashButton)
        }}
        onMouseDown={() => {
            // tempNPC.wearables.splice(((visibleIndex - 1) * 3) + row)
            updateWearables('wDelete', ((visibleIndex - 1) * 3) + row)
        }}
            />


          </UiEntity>


        </UiEntity>
    )
}

function extractValues(url: string): { firstValue: string, secondValue: string } {
    const parts = url.split('/');
  
    const firstValue = parts[5];
    const secondValue = parts[7];
  
    return { firstValue, secondValue };
  }

function addWearable(){
    // https://decentraland.org/marketplace/contracts/0xd62cb20c1fc76962aae30e7067babdf66463ffe3/items/0

    const { firstValue, secondValue } = extractValues(wearableLink);
    console.log(firstValue, secondValue)

    if(firstValue && secondValue){
        // tempNPC.wearables.push("" + firstValue + ":" + secondValue)
        updateWearables("wAdd", "" + firstValue + ":" + secondValue)
        updateNPCView("wMain")//
    }
}

function updateWearables(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.NPC_COMPONENT, type:type, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, value:value}})
    
    if(type === "update"){
        updateNPC()
    }
}


function selectNPCType(index:number){
    tempNPC.type = index
}

function selectNPCbodyShape(index:number){
    tempNPC.bodyShape = index
}

function updateNPC(){
    let wearables:string[] = []
    tempNPC.wearables.forEach((wearable:string)=>{
        wearables.push("urn:decentraland:matic:collections-v2:" + wearable)
    })
    AvatarShape.createOrReplace(selectedItem.entity, {
        id: tempNPC.name !== "" ? tempNPC.name : getRandomString(5),
        name: tempNPC.dName ? tempNPC.name : "",
        bodyShape: tempNPC.bodyShape == 0 ? "urn:decentraland:off-chain:base-avatars:BaseMale" :  "urn:decentraland:off-chain:base-avatars:BaseFemale",
        wearables:wearables,
        emotes:[],
        hairColor: Color4.create(tempNPC.hairColor.r / 255, tempNPC.hairColor.g / 255, tempNPC.hairColor.b / 255),
        skinColor: Color4.create(tempNPC.skinColor.r  / 255, tempNPC.skinColor.g / 255, tempNPC.skinColor.b / 255),
        eyeColor: Color4.create(tempNPC.eyeColor.r  / 255, tempNPC.eyeColor.g / 255, tempNPC.eyeColor.b / 255)
    })
}