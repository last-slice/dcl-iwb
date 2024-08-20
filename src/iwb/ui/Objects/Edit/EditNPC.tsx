import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { playAudioFile, stopAudioFile } from '../../../components/Sounds'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sceneEdit, selectedItem } from '../../../modes/Build'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { paginateArray } from '../../../helpers/functions'
import { setUIClicked } from '../../ui'
import { checkAvatarShape } from '../../../components/AvatarShape'
import { utils } from '../../../helpers/libraries'

export let npcComponentView = "main"

let npcData:any = {
    displayName:true,
    bodyShape:0,
    name:"",
    id:"",
    type:0,
    hairColor:{r:0, g:0, b:0, a:1},
    skinColor:{r:0, g:0, b:0, a:1},
    eyeColor:{r:0, g:0, b:0, a:1},
    wearables:[]
}

let visibleItems:any[] = []
let visibleIndex:number = 1

let wearableLink:string = ""

export function updateNPCView(view:string){
    let scene = localPlayer.activeScene
    if(!scene){//
        return
    }

    let itemInfo = scene[COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT].get(selectedItem.aid)
    if(!itemInfo){
        return
    }

    npcData = {...itemInfo}

    npcComponentView = view

    // if(view === "main"){
    //     !npcData.hairColor ? npcData.hairColor = {r:0, g:0, b:0, a:1} : null
    //     !npcData.skinColor ? npcData.skinColor = {r:0, g:0, b:0, a:1} : null
    //     !npcData.eyeColor ? npcData.eyeColor = {r:0, g:0, b:0, a:1} : null
    //     !npcData.wearables ? npcData.wearables = [] : null
    // }

    if(view === 'wMain'){
        refreshWearables()
    }
}

export async function refreshWearables(){
    visibleItems.length = 0

    let temp = paginateArray([...npcData.wearables], visibleIndex, 3)
    temp.forEach((item)=>{
        visibleItems.push({info:item, name:""})
    })

    visibleItems.forEach(async(item)=>{
        try{
            let info = await fetch("https://nft-api.decentraland.org/v1/collections?contractAddress=" + (item.info.split(":")[0]))
            let json = await info.json()
            if(json && json.data && json.data.length > 0){
                item.name = json.name
            }
        }
        catch(e){
            console.log('fetching wearable name error', e)
        }
    })
}

export function EditNPC() {
    return (
        <UiEntity
            key={resources.slug + "edit::npc::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT ? 'flex' : 'none',
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
  <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    display:'flex'
                }}
            >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
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
                    height: '80%',
                }}
            >

        <Input
                onChange={(value)=>{
                    npcData.name = value.trim()
                }}
                onSubmit={(value)=>{
                    npcData.name = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Enter new name'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                ></Input>

            </UiEntity>


                </UiEntity>



                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '100%',
                }}
            uiText={{value:"Show Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(5).width,
                    height: calculateSquareImageDimensions(5).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: npcData.displayName ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    npcData.displayName = !npcData.displayName
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
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
            uiText={{value:"Avatar Type", fontSize:sizeFont(20, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                key={resources.slug + "npc-type-dropdown"}
                options={["Avatar"]}//, "Custom"]}
                selectedIndex={npcData.type}
                onChange={selectNPCType}
                uiTransform={{
                    width: '100%',
                    height: '120%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                color={Color4.White()}
                fontSize={sizeFont(20,15)}
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
            uiText={{value:"Body Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                key={resources.slug + "npc-bodyShape-dropdown"}
                options={["Male", "Female"]}
                selectedIndex={npcData.bodyShape}
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
                    height: '15%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '100%',
                }}
            uiText={{value:"Hair Color (0 - 255)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                        npcData.hairColor.r = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.hairColor.r = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(12,10)}
                    placeholder={"" + npcData.hairColor.r}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                        npcData.hairColor.g = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.hairColor.g = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={"" + npcData.hairColor.g}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                        npcData.hairColor.b = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.hairColor.b = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={"" + npcData.hairColor.b}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                    height: '15%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '100%',
                }}
            uiText={{value:"Skin Color (0 - 255)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                        npcData.skinColor.r = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.skinColor.r = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={"" + npcData.skinColor.r}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',//
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
                        npcData.skinColor.g = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.skinColor.g = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={"" + npcData.skinColor.g}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                        npcData.skinColor.b = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.skinColor.b = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={"" + npcData.skinColor.b}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                    height: '15%',
                    display:'flex'
                }}
            >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '100%',
                }}
            uiText={{value:"Eye Color (0 - 255)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                        npcData.eyeColor.r = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.eyeColor.r = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={'' + npcData.eyeColor.r}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                        npcData.eyeColor.g = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.eyeColor.g = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={'' + npcData.eyeColor.g}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                        npcData.eyeColor.b = parseInt(value.trim())
                    }}
                    onSubmit={(value)=>{
                        npcData.eyeColor.b = parseInt(value.trim())
                    }}
                    fontSize={sizeFont(20,12)}
                    placeholder={'' + npcData.eyeColor.b}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
                    uiText={{textWrap:'nowrap', value: "Wearables", fontSize: sizeFont(20, 15)}}
                    onMouseDown={() => {
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
                    uiText={{value: "Update", fontSize: sizeFont(20, 15)}}
                    onMouseDown={() => {
                        setUIClicked(true)
                        update()
                        setUIClicked(false)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
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
            width: '50%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{textWrap:'nowrap',value: "Add Wearable", fontSize: sizeFont(20, 16)}}
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
            {
                visibleComponent === COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT &&
                generateWearableRows()
            }
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


function selectNPCType(index:number){
    npcData.type = index
}

function selectNPCbodyShape(index:number){
    npcData.bodyShape = index
}

function updateWearables(type:string, value:any){
    // sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT, type:type, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, value:value}})
}

function generateWearableRows(){
    let arr:any[] = []
    let count = 0
    
    visibleItems.forEach((wearable:string, i:number)=>{
        arr.push(<WearableRow data={wearable} rowCount={count} />)
        count++
    })
    return arr
}

function WearableRow(action:any){
    let data = action.data
    let row = action.rowCount
    return(
        <UiEntity
        key={resources.slug + "wearable-npc-row-"+ row}
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
                height: '90%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width:  calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(8).height
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: '' + "https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:" + data.info + "/thumbnail"
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
            uiText={{textWrap:'nowrap', textAlign:'middle-left', value:"" + data.name, fontSize:sizeFont(20,15), color:Color4.White()}}
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
            setUIClicked(true)
            updateWearable("deletewearable", ((visibleIndex - 1) * 3) + row)

            utils.timers.setTimeout(()=>{
                updateNPCView("wMain")//
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
            />


          </UiEntity>


        </UiEntity>
    )
}

function addWearable(){
    // https://decentraland.org/marketplace/contracts/0xd62cb20c1fc76962aae30e7067babdf66463ffe3/items/0

    const { firstValue, secondValue } = extractValues(wearableLink);
    console.log(firstValue, secondValue)

    if(firstValue && secondValue){
        // tempNPC.wearables.push("" + firstValue + ":" + secondValue)
        // console.log('npc data is' , npcData)
        // npcData.wearables.push(firstValue + ":" + secondValue)
        // console.log('npc data is now' , npcData)
        updateWearable("addwearable", firstValue + ":" + secondValue)
        utils.timers.setTimeout(()=>{
            updateNPCView("wMain")
        }, 200)
    }
}

function extractValues(url: string): { firstValue: string, secondValue: string } {
    const parts = url.split('/');
  
    const firstValue = parts[5];
    const secondValue = parts[7];
  
    return { firstValue, secondValue };
  }

function update(){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT,
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId, 
            npcData:npcData,
            action:"update"
        }
    )
}

function updateWearable(type:string, data:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT,
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId, 
            wearable:data,
            action:type
        }
    )
}