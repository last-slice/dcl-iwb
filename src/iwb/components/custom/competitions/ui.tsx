import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../ui/helpers'
import { uiSizes } from '../../../ui/uiConfig'
import { Color4 } from '@dcl/sdk/math'
import { addTeammate, attemptSignup, canSignup, competitionScenes, enabled, getEnabled, updateUI, votes, voting } from './BuildCompetition'
import resources from '../../../helpers/resources'
import { localUserId } from '../../player/player'
import { redrawCustomUI } from '../ui'

let showSplash = false
export function displaySplash(value:boolean){
    showSplash = value
}

let showSignup = false
export function displaySignup(value:boolean){
    showSignup = value
    if(value){
        team.mates = [localUserId]
    }
}

let newMate:string = ""
export let team:any = {
    name:"",
    mates:[]
}

export function addMate(mate:string){
    team.mates.push(mate.toLowerCase())
    updateUI()
}

function removeMate(index:number){
    team.mates.splice(index, 1)
    updateUI()
}

export function createBuildCompeitionUI(){
    return (
        <UiEntity
            key={"customui-build-competition"}
            uiTransform={{
                display: getEnabled() ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position:{left:'0%', top:'7%'}
            }}
        >
                {/* splash info  */}
            <UiEntity
            uiTransform={{
                display: showSplash ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(65, 2680/1500).width,
                height: calculateImageDimensions(40, 2680/1500).width,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(65,  2680/1500).width) / 2, top:'10%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/competition.png'
                },
            }}
            onMouseDown={()=>{
                displaySplash(false)
                updateUI()
            }}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(13, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(13, getAspect(uiSizes.vertRectangle)).width,
                positionType: 'absolute',
                position:{left:resources.DEBUG ? '20%' : '2%', top:'0%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
        >

            <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'10%'}
            }}
            uiText={{value:"Build Competition", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                display: voting ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'10%'}
            }}
            uiText={{value:"Voting ends\nMarch 20th!", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

    <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:'5%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value:"Details", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                displaySplash(true)
                updateUI()
            }}
        />

<UiEntity
            uiTransform={{
                display: canSignup && localUserId && !competitionScenes.find((scene:any)=> scene.builder === localUserId) ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value:"Signup", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                // attemptSignup()
                displaySignup(true)
                updateUI()
            }}
        />

        <UiEntity
            uiTransform={{
                display: voting ? 'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiText={{value:"Your Votes: " + votes + "/3", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

        </UiEntity>

           {/* team sign up info  */}
           <UiEntity
            uiTransform={{
                display: showSignup ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '15%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                positionType:'absolute',
                position:{top:0, left:0},
                margin:{top:"2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"IWB Build Competition #2 Sign up Form", fontSize:sizeFont(30,20), color:Color4.White(), textAlign:'middle-center'}}
            />


                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '85%',
                    margin:{left:"1%"},
                    padding:{left:"1%", right:'2%', bottom:'2%'}
                }}
                // uiBackground={{color:Color4.Green()}}
                >

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}//
            uiText={{value:"Team Name:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ team.name = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"Enter team name"}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '80%',
                    height:'10%',
                }}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Add teammate address:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
            }}
            >

            <Input
                onChange={(e) =>{ newMate = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"Enter teammate wallet address"}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height:'100%',
                    margin:{right:'3%'}
                }}
            />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Add", color:Color4.White(), fontSize:sizeFont(20,15)}}
            onMouseDown={()=>{
                // addMate(newMate)
                addTeammate(newMate)
            }}
            />

            </UiEntity>

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '80%',
                height: '40%',
                margin:{top:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value: "Teammates", color:Color4.White(), fontSize:sizeFont(20,15)}}
            />

        {generateRows()}

            </UiEntity>

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
                margin:{top:'2%'}
            }}
            >

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Signup", color:Color4.White(), fontSize:sizeFont(20,15)}}
            onMouseDown={()=>{
                attemptSignup()
                displaySignup(false)
                updateUI()
            }}
            />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{left:'5%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Cancel", color:Color4.White(), fontSize:sizeFont(20,15)}}
            onMouseDown={()=>{
                displaySignup(false)
                updateUI()
            }}
            />

          
            </UiEntity>





            </UiEntity>


        </UiEntity>

        </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    let count = 0
    team.mates.forEach((mate:any) => {
        arr.push(<MateRow data={mate} rowCount={count} />)
        count++
    });
    return arr
}

function MateRow(data:any){
    return (
        <UiEntity
            key={"iwb-team-row-" + data.rowCount}
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{left:'1%', top:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: data.rowCount % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

                :

                getImageAtlasMapping(uiSizes.rowPillDark)
            }}
            >

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '100%',
            }}
            uiText={{value:"" + (localUserId && data.data === localUserId ? "You" : data.data), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                display: localUserId ? data.data !== localUserId ? 'flex' : "none" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                height: calculateImageDimensions(1.5,getAspect(uiSizes.trashButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.trashButton)
            }}
            onMouseDown={()=>{
                removeMate(data.rowCount)
            }}
            />


            </UiEntity>
    )
}

