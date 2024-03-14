import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'

export let show = false

let list:any[] = []
export function displayUGCSceneList(value: boolean, l?:any) {
    show = value
    if(value){
        list = l
    }
}

export function createUGCSceneListPanel() {
    return (
        <UiEntity
            key={"iwbugcscenelistpanel"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height) / 2 }
            }}
        // uiBackground={{ color: Color4.Red() }}//
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:'flex',
                    justifyContent:'flex-start'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangle)
                }}
            >
                
                {/* header label */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                        display:'flex',
                        margin:{top:'10%'}
                    }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"UGC Asset Found", fontSize: sizeFont(45,30), color: Color4.White()}}
                />

                    {/* popup text */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '20%',
                        }}
                        uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("Please delete the UGC Asset from the following scenes before the system can remove your UGC Asset.", true, 30)}}
                    />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{top:"3%", bottom:'1%'},
            }}
            >
                {generateSceneList()}
            </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                displayUGCSceneList(false)
            }}
            uiText={{value: "Ok", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}

function generateSceneList(){
    let arr:any[] = []
    list.forEach((name:string)=>{
        arr.push(
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height:'5%',
                margin:{top:"1%", bottom:'1%'},
            }}
            uiText={{value: "" + name, color:Color4.Yellow(), fontSize:sizeFont(30,20)}}
            />
        )
    })
    return arr
}