import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { settingsView } from './settingsPanel'
import { items } from '../../../components/catalog'
import { buildPlaylist, buildPlaylistIndex, changeBuildVolume, playNextSong, playPlaylist, playlistEntity, stopPlaylist } from '../../../components/sounds'
import { AudioSource } from '@dcl/sdk/ecs'

let playlistIndex:number = 0
let audionames:any[] = []

export function AudioSettings() {
    return (
        <UiEntity
            key={"audiosettings"}
            uiTransform={{
                display: settingsView === "Audio" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '80%',
                height: '100%',
                margin:{bottom:'10%'}
            }}
            >

            {/* playlist row */}
        {/* <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '15%',
            }}
            > */}

            {/* playlist label */}
            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Current Playlist:", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            >
                        <Dropdown
                key={"audio-playlist-dropdown"}
                options={getAudioPlaylists()}
                onChange={updatePlaylist}
                uiTransform={{
                    width: '95%',
                    height: '50%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
                />
                

            </UiEntity>

        </UiEntity> */}

          {/* artist row */}
          {/* <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '15%',
            }}
            > */}

            {/* artist label */}
            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Current Artist:", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Mease", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />
                
        </UiEntity> */}

             {/* track row */}
             <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '15%',
            }}
            >

            {/* track label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Current Track:", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"" + (buildPlaylist.length > 0 && buildPlaylist[buildPlaylistIndex].n), fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />
                
        </UiEntity>

             {/* volume row */}
             <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '15%',
            }}
            >

            {/* volume label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Volume: " + (AudioSource.has(playlistEntity) && AudioSource.get(playlistEntity).volume?.toFixed(1)), fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '50%',
                height: '100%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '50%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Dwn", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                changeBuildVolume(-.1)
            }}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '50%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Up", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                changeBuildVolume(.1)
            }}
            />

            </UiEntity>

            
                
        </UiEntity>

                 {/* controls row */}
                 <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            >

            {/* Rewind Button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '23%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Rewind", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                playNextSong(-1)
            }}
            />

             {/* Pause Button */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '23%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Pause", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                stopPlaylist()
            }}
            />

             {/* Play Button */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '23%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Play", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                playPlaylist()
            }}
            />

             {/* Seek Button */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '23%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            uiText={{value:"Seek", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                playNextSong(1)
            }}
            />
                
                 </UiEntity>

                                  {/* playback row */}
                                  <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            >
           
                 </UiEntity>

        </UiEntity>
    )
}

function getAudioPlaylists(){
    let audioItems = [...items.values()].filter((item:any)=> item.ty === "Audio")
    let categories:string[] = []

    const groupedData: { [category: string]: any[] } = {};

    for (const item of audioItems) {
      const { sty, n } = item;
  
      if (!groupedData[sty]) {
        groupedData[sty] = [];
      }
  
      groupedData[sty].push({ n });
    }

    for(const cat in groupedData){
        categories.push(cat)
    }
  
    return categories;
}

function updatePlaylist(index:number){

}