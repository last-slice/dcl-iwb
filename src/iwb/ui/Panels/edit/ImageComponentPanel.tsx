import ReactEcs, {
    Button,
    Label,
    ReactEcsRenderer,
    UiEntity,
    Position,
    UiBackgroundProps,
    Input
} from '@dcl/sdk/react-ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import {calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {visibleComponent} from './EditObjectDataPanel'
import {COMPONENT_TYPES, SERVER_MESSAGE_TYPES} from '../../../helpers/types'
import {sendServerMessage} from '../../../components/messaging'
import {selectedItem} from '../../../components/modes/build'
import {items} from '../../../components/catalog'
import {sceneBuilds} from '../../../components/scenes'
import { uiSizes } from '../../uiConfig'

let value = ""

export function ImageComponentPanel() {
    return (
        <UiEntity
            key={"editimagecomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.IMAGE_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* url label */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
                uiText={{value: "URL", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            {/* url input info */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
            >

                <Input
                    onSubmit={(input) => {
                        value = input
                    }}
                    onChange={(input) => {
                        value = input
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'new image link'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    value={"" + (visibleComponent === COMPONENT_TYPES.IMAGE_COMPONENT ? getImage() : "")}
                    onMouseDown={() => {
                        console.log('clicked')
                    }}
                ></Input>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Save",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {
                            component: COMPONENT_TYPES.IMAGE_COMPONENT,
                            action: "update",
                            data: {aid: selectedItem.aid, sceneId: selectedItem.sceneId, url: value}
                        })

                    }}
                />
            </UiEntity>
        </UiEntity>
    )
}

function getImage() {
    let scene = sceneBuilds.get(selectedItem.sceneId)
    let asset = scene.ass.find((a: any) => a.aid === selectedItem.aid)
    if (asset && asset.imgComp) {
        return asset.imgComp.url
    }
}
