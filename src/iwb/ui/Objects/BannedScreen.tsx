import ReactEcs, {Dropdown, Input, UiBackgroundProps, UiEntity, UiLabelProps} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { Color4 } from '@dcl/sdk/math'
import { sizeFont } from '../helpers'

let showBanned = false

export function showBannedScreen(){
    showBanned = true
}

export function createBannedScreen(){
    return(
        <UiEntity
        key={resources.slug + "banned:screen"}
        uiTransform={{
          width: '100%',
          height:'100%',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center',
          alignItems:'center',
          positionType:'absolute',
          position:{top:0, right:0},
          display: showBanned ? "flex" :"none"
        }}
        uiBackground={{color:Color4.Black()}}
        uiText={{value:"BANNED FROM THIS WORLD!", fontSize:sizeFont(60,50), textAlign:'middle-center', color:Color4.White()}}
      />
    )
}