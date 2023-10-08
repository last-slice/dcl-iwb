import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { PillPanel } from './PillPanel'
import { attemptAssetUploader } from '../helpers/functions'

export let showAssetUI = false

export function displayAssetUploadUI(value: boolean) {
    showAssetUI = value
}

export function createAssetUploadUI() {
    return (
        <PillPanel show={showAssetUI} hide={()=>{displayAssetUploadUI(false)}} accept={()=>{attemptAssetUploader()}}>
        </PillPanel>
    )
}