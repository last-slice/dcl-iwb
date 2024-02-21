
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { Actions, COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_EMOTES_SLUGS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { AvatarShape } from '@dcl/sdk/ecs'
import { getRandomString } from '../../../helpers/functions'

let view = "list"
let tempNPC:any = {
    dName:true,
    bodyShape:0,
    name:"",
    id:"",
    type:0,
    hairColor:{r:0, g:0, b:0, a:1},
    skinColor:{r:0, g:0, b:0, a:1},
    eyeColor:{r:0, g:0, b:0, a:1}
}

export function updateNPCView(v:string){
    view = v

    if(v==="main"){
        tempNPC = selectedItem.itemData.npcComp

        !tempNPC.hairColor ? tempNPC.hairColor = {r:0, g:0, b:0, a:1} : null
        !tempNPC.skinColor ? tempNPC.skinColor = {r:0, g:0, b:0, a:1} : null
        !tempNPC.eyeColor ? tempNPC.eyeColor = {r:0, g:0, b:0, a:1} : null
    }
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
                display: visibleComponent === COMPONENT_TYPES.NPC_COMPONENT ? 'flex' : 'none',//
            }}
        >


        {/* add npc name row */}
        {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
                display: view === "list" ? "flex" : "none"
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
        uiText={{value: "Add Action", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateActionView("add")
        }}
    />

        </UiEntity> */}

            {/* action rows */}
            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: view === "list" ? "flex" : "none"
            }}
            >   
            {generateActionRows()}
            </UiEntity> */}


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
            width: calculateSquareImageDimensions(4).width,
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
                updateAction()
            }}
        />
        </UiEntity>
     
        </UiEntity>
    )
}

// function generateActionRows(){
//     let arr:any[] = []
//     let count = 0
//     let actions:any[] = selectedItem && selectedItem.enabled && selectedItem.itemData.actComp ? [...selectedItem.itemData.actComp.actions.values()] : []
    
//     actions.forEach((action, i:number)=>{
//         arr.push(<ActionRow data={action} rowCount={count} />)
//         count++
//     })
//     return arr//
// }

// function ActionRow(action:any){
//     let data = action.data
//     return(
//         <UiEntity
//         key={"action-row-"+ action.rowCount}
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '20%',
//                 margin:{top:"1%", bottom:'1%'}
//             }}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
//             >  

//             {/* action name column */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40%',
//                 height: '85%',
//             }}
//             >


//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '50%',
//             }}
//             uiText={{value:"Name", fontSize:sizeFont(20,15), color:Color4.White()}}
//         />

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '50%',
//             }}
//             uiText={{value:"" + data.name, fontSize:sizeFont(20,15), color:Color4.White()}}
//         />


//             </UiEntity>


//             {/* action action column */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40%',
//                 height: '85%',
//             }}
//             >

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '50%',
//             }}
//             uiText={{value:"Value", fontSize:sizeFont(20,15), color:Color4.White()}}
//         />//

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40%',
//                 height: '100%',
//             }}
//             uiText={{value:"" + ENTITY_ACTIONS_LABELS[ENTITY_ACTIONS_SLUGS.findIndex((ea)=> ea === data.type)], fontSize:sizeFont(20,15), color:Color4.White()}}
//         />

//             </UiEntity>

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '20%',
//                 height: '100%',
//             }}
//         >

//         <UiEntity
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
//                 height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height
//         }}
//         uiBackground={{
//             textureMode: 'stretch',
//             texture: {
//                 src: 'assets/atlas1.png'
//             },
//             uvs: getImageAtlasMapping(uiSizes.trashButton)
//         }}
//         onMouseDown={() => {
//             //DELETE ACTION//
//             updateAction('delete', 'remove', {name:data.name})
//         }}
//     />//


//         </UiEntity>


//             </UiEntity>
//     )
// }

// function selectAction(index:number){
//     selectedIndex = index
// }

// function buildAction(){
//     updateAction("add", "new", {name: newName, action:getActionData()})
// }

function updateAction(){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.NPC_COMPONENT, type:'update', data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, value:tempNPC}})
    updateNPC()
}


function selectNPCType(index:number){
    tempNPC.type = index
}

function selectNPCbodyShape(index:number){
    tempNPC.bodyShape = index
}

function updateNPC(){
    AvatarShape.createOrReplace(selectedItem.entity, {
        id: tempNPC.name !== "" ? tempNPC.name : getRandomString(5),
        name: tempNPC.dName ? tempNPC.name : "",
        bodyShape: tempNPC.bodyShape == 0 ? "urn:decentraland:off-chain:base-avatars:BaseMale" :  "urn:decentraland:off-chain:base-avatars:BaseFemale",
        wearables:[],
        emotes:[],
        hairColor: Color4.create(tempNPC.hairColor.r / 255, tempNPC.hairColor.g / 255, tempNPC.hairColor.b / 255),
        skinColor: Color4.create(tempNPC.skinColor.r  / 255, tempNPC.skinColor.g / 255, tempNPC.skinColor.b / 255),
        eyeColor: Color4.create(tempNPC.eyeColor.r  / 255, tempNPC.eyeColor.g / 255, tempNPC.eyeColor.b / 255)
    })
}