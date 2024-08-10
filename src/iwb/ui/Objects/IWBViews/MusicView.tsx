import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources, { audiusMoodEndpoints } from '../../../helpers/resources'
import { mainView } from '../IWBView'
import { data } from '../../../components/Colyseus'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { setUIClicked } from '../../ui'
import { formatDollarAmount, getRandomIntInclusive, paginateArray } from '../../../helpers/functions'
import { playSound } from '../../../components/Sounds'
import { SOUND_TYPES } from '../../../helpers/types'
import { AudioStream, engine, Entity } from '@dcl/sdk/ecs'

let APP_NAME = 'iwb-audius-player'

export let streamEntity:Entity

let musicView = "main"
let moodsView = "main"
let selectedCategory:string = ""
let server:string = ""
let prevArtist:string = ""

let init:boolean = false
let loading:boolean = false
let shuffle:boolean = false
let repeat:boolean = false

let visiblePage:number = 1
let retries:number = 0
let moodIndex:number = 0

let servers:any[] = []
let visibleItems:any[] = []
let currentPlaylist:any[] = []
let moodList:any[] = []

let selectedMood:string = ""
let selectedPlaylist:any

let currentTrack:any = {
    artist:"",
    title:"No Track Selected",
    image:"",
    count:"",
    duration:0,
    pointer:0,
    time:0,
    volume:0.5,
    playing:false
}

let currentArtist:any = {
    cover:"",
    profile:"",
    handle:"",
    name:"",
    bio:"",
    trackCount:0,
    followers:0,
    following:0,
}

export function addStreamEntity(){
  streamEntity = engine.addEntity()
}

export async function updateMusicView(){
    if(!init){
        init = true
        await getServers()
    }
    chooseServer()

    visiblePage = 1
}

async function getServers(){
    try{    
        let res = await fetch("https://api.audius.co/")
        let json = await res.json()

      console.log('init player json is', json)
      if(json.data){
        servers = json.data
      }
    }
      catch(e){
        console.log('error getting servers', e)
      }
}

function chooseServer(){
    server = servers[getRandomIntInclusive(0, servers.length -1)]
}

export function MusicView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-music"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:mainView === "Audius" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Red()}}
        >

 {/* audius player planel */}
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '20%',
      }}
      >
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(31, 3.86).width,
          height: calculateImageDimensions(31, 3.86).height,
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusPlayerBG,
          },
          uvs:getImageAtlasMapping(resources.uvs.audiusPlayerBG)
      }}
      >

{/* now playing track title */}
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '97%',
          height: '45%',
      }}
    //   uiBackground={{color:Color4.Blue()}}
      >
        <UiEntity
        uiTransform={{
          width: '100%',
          height: '25%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          margin:{bottom:'1%'}
        }}
        uiText={{textWrap:'nowrap', value:"" + currentTrack.title, color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-center'}}
      />

<UiEntity
    uiTransform={{
        width: '100%',
        height: '25%',
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        margin:{bottom:'1%'}
    }}
    uiText={{textWrap:'nowrap', value:"" + currentTrack.artist, color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-center'}}
    />

    </UiEntity>

        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '97%',
          height: '55%',
      }}
    //   uiBackground={{color:Color4.Green()}}
      >

{/* now playing artist image */}
<UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Teal()}}
      >

      </UiEntity>

      {/* now playing controls */}
      <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40%',
          height: '100%',
      }}
      >

{/* shuffle button */}
<UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '15%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Yellow()}}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          height: '40%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusShuffleButton,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusShuffleButton)
      }}
      />
</UiEntity>

{/* rewind button */}
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Blue()}}
      >
         <UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60%',
          height: '30%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusRewindButton,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusRewindButton)
      }}
      onMouseDown={()=>{
        setUIClicked(true)
        if(currentTrack.title !== "No Track Selected"){
            attemptRewind()
        }
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />
        </UiEntity>

      {/* now playing button */}
    <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Teal()}}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '65%',
          height: '90%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: currentTrack.playing ? resources.textures.audiusPauseButton : resources.textures.audiusPlayButton,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusPlayButton)
      }}
      onMouseDown={()=>{
        setUIClicked(true)
        if(currentTrack.playing){
            pausePlayer()
        }else{
            if(currentTrack.title !== "No Track Selected"){
                playTrack()
            }
        }
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />

        </UiEntity>
        
        {/* seek forward  */}
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Red()}}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60%',
          height: '30%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusSeekButton,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusSeekButton)
      }}
      onMouseDown={()=>{
        setUIClicked(true)
        if(currentTrack.title !== "No Track Selected"){
            attemptSeek()
        }
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />
        </UiEntity>

      {/* repeat track button */}
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '15%',
          height: '100%',
      }}
    //   uiBackground={{color:Color4.Purple()}}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60%',
          height: '40%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusRepeatButton,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusRepeatButton)
      }}
      />
        </UiEntity>

      </UiEntity>

{/* now playing volume */}
      <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30%',
          height: '50%',
      }}
      // uiBackground={{color:Color4.Red()}}
      >

<UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '15%',
          height: '100%',
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusVolumeIcon
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusVolumeButton)
      }}
      />

<UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '70%',
          height: '50%',
          margin:'1%'
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusVolumeBG
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusVolumeBG)
      }}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: mainView === "Audius" ? `${currentTrack.volume * 100}%` : '100%',
          height: '100%',
          positionType:'absolute',
          position:{left:0}
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: resources.textures.audiusVolumePill
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusVolumePill)
      }}
      />

<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      flexDirection:'row',
      alignContent:'center',
      alignItems:"center",
      justifyContent:'flex-start',
      positionType:'absolute',
      position:{left:0}
    }}
    onMouseDown={()=>{
      console.log('volumne down')
      if(currentTrack.volume > 0){
        updateVolume(-10)
      }
    }}
     uiBackground={{
      // color:Color4.Red()
    }}
    />

<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      flexDirection:'row',
      alignContent:'center',
      alignItems:"center",
      justifyContent:'flex-start',
      positionType:'absolute',
      position:{right:0}
    }}
    onMouseDown={()=>{
      console.log('volumne up')
      if(currentTrack.volume < 100){
        updateVolume(10)
      }
    }}
     uiBackground={{
      // color:Color4.Green()
    }}
    />

      </UiEntity>

      </UiEntity>

      </UiEntity>

      </UiEntity>


</UiEntity>


      {/* main info panel */}
      <UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          height: '90%',
          margin:{top:'1%'}
      }}
      >

        {/* left column categories panel */}
        <UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '20%',
          height: '100%',
      }}
      >
        <UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
         margin:{top:"1%", bottom:"1%"}
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
              src: selectedCategory === "Trending" ? resources.textures.audiusPlayerCatBG : resources.textures.audiusPlayerNoSelectCatBG,
          },
          uvs: getImageAtlasMapping(resources.uvs.audiusPlayerCatBG)
      }}
      uiText={{textWrap:'nowrap', value:"Trending", textAlign:"middle-center", fontSize:sizeFont(25,15)}}
      onMouseDown={()=>{
        setUIClicked(true)
        chooseCategory("Trending")
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
         margin:{top:"1%", bottom:"1%"}
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
            src: selectedCategory === "Explore" ? resources.textures.audiusPlayerCatBG : resources.textures.audiusPlayerNoSelectCatBG,
          },
          uvs:getImageAtlasMapping(resources.uvs.audiusPlayerCatBG)
      }}
      uiText={{textWrap:'nowrap', value:"Explore", textAlign:"middle-center", fontSize:sizeFont(25,15)}}
      onMouseDown={()=>{
        setUIClicked(true)
        selectedCategory = "Explore"
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
         margin:{top:"1%", bottom:"1%"}
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
            src: selectedCategory === "Moods" ? resources.textures.audiusPlayerCatBG : resources.textures.audiusPlayerNoSelectCatBG,
          },
          uvs:getImageAtlasMapping(resources.uvs.audiusPlayerCatBG)
      }}
      uiText={{textWrap:'nowrap', value:"Moods", textAlign:"middle-center", fontSize:sizeFont(25,15)}}
      onMouseDown={()=>{
        setUIClicked(true)
        selectedCategory = "Moods"
        selectedMood = ""
        moodsView = "main"
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
         margin:{top:"1%", bottom:"1%"}
      }}
      uiBackground={{
        textureMode: 'stretch',
          texture: {
            src: selectedCategory === "More Info" ? resources.textures.audiusPlayerCatBG : resources.textures.audiusPlayerNoSelectCatBG,
          },
          uvs:getImageAtlasMapping(resources.uvs.audiusPlayerCatBG)
      }}
      uiText={{textWrap:'nowrap', value:"More Info", textAlign:"middle-center", fontSize:sizeFont(25,15)}}
      onMouseDown={()=>{
        setUIClicked(true)
        selectedCategory = "More Info"
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      />

{/* paginate buttons */}
<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
    >

             <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(3).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
        }}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            switch(selectedCategory){
              case 'Trending':
                if(visiblePage - 1 > 0){
                  visiblePage--
                  refreshVisibleItems(selectedCategory === "Trending" ? 3 : undefined)
              }
                break;

              case 'Moods':
                if(moodsView !== "main"){
                  if(visiblePage - 1 > 0){
                    visiblePage--
                    moodIndex--
                    getNextMoodPlaylist()
                  }
                }
                break;

            }

        }}
        />

        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(3).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
        }}
        onMouseDown={()=>{
            // playSound(SOUND_TYPES.SELECT_3)

            switch(selectedCategory){
                case 'Trending':
                  if ((visiblePage + 1 <= Math.floor([...currentPlaylist].length / 3) + 1)){
                    visiblePage++
                    refreshVisibleItems(selectedCategory === "Trending" ? 3 : undefined)
                }
                  break;

                case 'Moods':
                  if(moodsView !== "main"){
                    console.log('moods is not main, letspage ')
                    if ((visiblePage + 1 <=[...moodList].length + 1)){
                      visiblePage++
                      moodIndex++
                      getNextMoodPlaylist()
                    }
                  }
                  break;
            }
        }}
        />
        

</UiEntity>

{/* page numbers */}
<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        uiText={{textWrap:'nowrap', value:"Page " + visiblePage + " / " + getPageType() , fontSize:sizeFont(20,15), textAlign:'middle-center'}}
    />

        </UiEntity>

      {/* right info panel */}
        <UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          height: '100%',
      }}
    //   uiBackground={{
    //     textureMode: 'stretch',
    //       texture: {
    //           src: resources.textures.audiusInfoPanelBG,
    //       },
    //       uvs:getImageAtlasMapping(resources.uvs.audiusInfoPanelBG)
    //   }}
      >

<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10%',
          height: '100%',
          display: loading ? "flex" : "none"
      }}
      uiText={{textWrap:'nowrap', value:"Loading...", textAlign:'middle-center', fontSize:sizeFont(25,20)}}
      />

      <TrendingPanel/>
      <ExplorePanel/>
      <MoodsPanel/>

        </UiEntity>

        </UiEntity>


            </UiEntity>
    )
}

function ExplorePanel(){
  return(
    <UiEntity
        key={resources.slug + "audius::explore::panel"}
          uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '98%',
              height: '100%',
              display: !loading && selectedCategory === "Explore" ? "flex" : "none"
          }}
          >

          <UiEntity
              uiTransform={{
                  flexDirection: 'row',
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
                  width: calculateImageDimensions(10, 1.16).width,
                  height: calculateImageDimensions(10, 1.16).height,
                  margin:'1%'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.audiusTrendingBG
                },
            }}
          />

      <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, 1.16).width,
                height: calculateImageDimensions(10, 1.16).height,
                margin:'1%'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                  src: resources.textures.audiusTopAlbums
              },
          }}
        />

          </UiEntity>

          <UiEntity
              uiTransform={{
                  flexDirection: 'row',
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
                  width: calculateImageDimensions(10, 1.16).width,
                  height: calculateImageDimensions(10, 1.16).height,
                  margin:'1%'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.audiusUndergroundBG
                },
            }}
          />

      <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, 1.16).width,
                height: calculateImageDimensions(10, 1.16).height,
                margin:'1%'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                  src: resources.textures.audiusFeelingLuckyBG
              },
          }}
        />

          </UiEntity>

            </UiEntity>
  )
}

function MoodsPanel(){
  return(
    <UiEntity
        key={resources.slug + "audius::moods::panel"}
          uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '98%',
              height: '100%',
              display: !loading && selectedCategory === "Moods"? "flex" : "none"
          }}
          >

          <UiEntity
          uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              height: '100%',
              display: moodsView ==="main" ? "flex" : "none"
          }}
          >

          <UiEntity 
              uiTransform={{
                width: '95%',
                height: '15%',
                display: 'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                margin:{top:'1%'}
              }}
          >
          <UiEntity 
              uiTransform={{
                width: calculateImageDimensions(25, 6.95).width,
                height: calculateImageDimensions(25, 6.95).height,
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusChillBG
                }
            }}
            onMouseDown={()=>{
              setUIClicked(true)
              selectMood("Chill")
              setUIClicked(false)
            }}
            onMouseUp={()=>{
              setUIClicked(false)
            }}
            />
            </UiEntity>

            <UiEntity 
              uiTransform={{
                width: '95%',
                height: '15%',
                display: 'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                margin:{top:'1%'}
              }}
          >
          <UiEntity 
              uiTransform={{
                width: calculateImageDimensions(25, 6.95).width,
                height: calculateImageDimensions(25, 6.95).height,
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusUpbeatBG
                }
            }}
            onMouseDown={()=>{
              setUIClicked(true)
              selectMood("Upbeat")
              setUIClicked(false)
            }}
            onMouseUp={()=>{
              setUIClicked(false)
            }}
          >
            </UiEntity>
            </UiEntity>

            <UiEntity 
              uiTransform={{
                width: '95%',
                height: '15%',
                display: 'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                margin:{top:'1%'}
              }}
          >
          <UiEntity 
              uiTransform={{
                width: calculateImageDimensions(25, 6.95).width,
                height: calculateImageDimensions(25, 6.95).height,
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusIntenseBG
                }
            }}
            onMouseDown={()=>{
              setUIClicked(true)
              selectMood("Intense")
              setUIClicked(false)
            }}
            onMouseUp={()=>{
              setUIClicked(false)
            }}
          >
            </UiEntity>
            </UiEntity>

            <UiEntity 
              uiTransform={{
                width: '95%',
                height: '15%',
                display: 'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                margin:{top:'1%'}
              }}
          >
          <UiEntity 
              uiTransform={{
                width: calculateImageDimensions(25, 6.95).width,
                height: calculateImageDimensions(25, 6.95).height,
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusProvokingBG
                }
            }}
            onMouseDown={()=>{
              setUIClicked(true)
              selectMood("Provoking")
              setUIClicked(false)
            }}
            onMouseUp={()=>{
              setUIClicked(false)
            }}
          >
            </UiEntity>
            </UiEntity>

            <UiEntity 
              uiTransform={{
                width: '95%',
                height: '15%',
                display: 'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                margin:{top:'1%'}
              }}
          >
          <UiEntity 
              uiTransform={{
                width: calculateImageDimensions(25, 6.95).width,
                height: calculateImageDimensions(25, 6.95).height,
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusIntimateBG
                }
            }}
            onMouseDown={()=>{
              setUIClicked(true)
              selectMood("Intimate")
              setUIClicked(false)
            }}
            onMouseUp={()=>{
              setUIClicked(false)
            }}
          >
            </UiEntity>
            </UiEntity>

            </UiEntity>

            <PlaylistInfoPanel/>

            </UiEntity>
  )
}

async function getNextMoodPlaylist(){
  await refreshVisibleItems(1, [...moodList])
  getPlaylistTracks(moodList[moodIndex].playlist.id)
}

function getPageType(){
  switch(selectedCategory){
    case 'Trending':
      return Math.floor([...currentPlaylist].length / 3)
    
    case 'Moods':
      return [...moodList].length
  }
  return ""
}

async function selectMood(mood:string){
  loading = true
  selectedMood = mood
  moodsView = "info"

  moodList.length = 0
  moodIndex = 0
  await getMoodList()
}

async function getPlaylistTracks(id:string){
  console.log('visible items is', visibleItems)
  console.log('plaulist id is', id)
  if(moodList[moodIndex].loaded){
    console.log('already loaded info')
    return
  }
  else{
    try{
      let playlistTracks = await fetch(server + "/" + resources.audius.endpoints.playlistInfo + "/" + id + "/tracks?app_name=" + APP_NAME)
      let playlistTrackData =  await playlistTracks.json()
      console.log('playlist tracks', playlistTrackData)
      moodList[moodIndex].tracks = []
      moodList[moodIndex].tracks = playlistTrackData.data
      moodList[moodIndex].loaded = true
    }
    catch(e){
      console.log('error getting playlist info', e)
    }
  }
}

async function getMoodList(){
  try{    
    for(let i = 0; i < audiusMoodEndpoints[selectedMood].length; i++){
        let res = await fetch(server +  "/" + audiusMoodEndpoints[selectedMood][i] + "?app_name=" + APP_NAME)
        let json = await res.json()
        if(json.data.length > 0){
            json.data.forEach((list:any)=>{
                let data:any = {}
                data.loaded = false
                data.playlist = list
                data.tracks = []
                moodList.push(data)
            })
        }   
    }
    loading = false
    console.log('mood list is', moodList)
    await getPlaylistTracks(moodList[moodIndex].playlist.id)
  }
  catch(e){
      console.log('error fetching chill playlists', e)
  }
}

function PlaylistInfoPanel(){
  return(
    <UiEntity
        key={resources.slug + "audius::moods::panel"}
          uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '98%',
              height: '100%',
              display: !loading && selectedCategory === "Moods" && moodsView === "info" ? "flex" : "none"
          }}
          >
      <UiEntity 
                    uiTransform={{
                      width: '95%',
                      height: '15%',
                      display: 'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      justifyContent:'center',
                      margin:{top:'1%'}
                    }}
                >
                <UiEntity 
                    uiTransform={{
                      width: calculateImageDimensions(25, 6.95).width,
                      height: calculateImageDimensions(25, 6.95).height,
                      display: 'flex',
                      flexDirection:'row',
                    }}
                    uiBackground={{
                      textureMode: 'stretch',
                      texture: {
                      src: getMood()
                      }
                  }}
                >
                  </UiEntity>
      </UiEntity>

      <UiEntity 
              uiTransform={{
                width: '100%',
                height: '85%',
                display: 'flex',
                flexDirection:'row',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.audiusMoodBG
                }
            }}
            >
              <UiEntity
        uiTransform={{
          width: '100%',
          height: '30%',
          display: 'flex',
          flexDirection:'row',
          alignItems:'center',
          margin:{bottom:'1%'}
        }}
      >
        {/* playlist image */}
         <UiEntity
        uiTransform={{
          width: '20%',
          height: '100%',
          display: 'flex',
          flexDirection:'row',
          alignItems:'center',
        }}
      ></UiEntity>

{/* playlist name and artist */}
<UiEntity
        uiTransform={{
          width: '70%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
      >
          <UiEntity
        uiTransform={{
          width: '100%',
          height: '40%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + (moodList.length > 0 ? moodList[moodIndex].playlist.playlist_name.length > 25 ? moodList[moodIndex].playlist.playlist_name.substring(0,25) + "..." : moodList[moodIndex].playlist.playlist_name : ""), color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-center'}}
      />

<UiEntity
        uiTransform={{
          width: '100%',
          height: '40%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + (moodList.length > 0 ? moodList[moodIndex].playlist.user.name.length > 25 ? moodList[moodIndex].playlist.user.name.substring(0,25) + "..." : moodList[moodIndex].playlist.user.name : ""), color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-center'}}
      />
</UiEntity>

{/* playlist play button */}
<UiEntity
        uiTransform={{
          width: '10%',
          height: '100%',
          display: 'flex',
          flexDirection:'row',
          alignItems:'center',
        }}
      ></UiEntity>


      </UiEntity>

            </UiEntity>
          </UiEntity>
    )
}

function getMood(){
  switch(selectedMood){
    case 'Chill':
      return resources.textures.audiusChillBG

    case 'Upbeat':
      return resources.textures.audiusUpbeatBG

    case 'Intense':
      return resources.textures.audiusIntenseBG

    case 'Provoking':
      return resources.textures.audiusProvokingBG

    case 'Intimate':
      return resources.textures.audiusIntimateBG
  }
  return ""
}


function TrendingPanel(){
    return(
<UiEntity
    key={resources.slug + "audius::trending::panel"}
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '98%',
          height: '100%',
          display: !loading && selectedCategory === "Trending" ? "flex" : "none"
      }}
      >

        {getVisibleTrendingItems()}

      </UiEntity>
    )
}

function getVisibleTrendingItems(){
    let arr:any[] = []
    let count = 0
    selectedCategory === "Trending" && visibleItems.forEach((item:any, i:number)=>{
        arr.push(<TrendingItem data={item} count={count}/>)
        count++
    })
    return arr
}

function TrendingItem(data:any){
    return(
        <UiEntity
            key={resources.slug + "audius::trending::panel::item::" + data.count}
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '33%',
          margin: { top: '1%', bottom: '1%'},
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
        src: resources.textures.audiusTrendingItemBG
        }
    }}
      >

    {/* trending image column */}
<UiEntity
        uiTransform={{
          width: '25%',
          height: '85%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          margin:{left:'2%'}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: data.data.image,
            }
          }}
      />

{/* track info panel */}
<UiEntity
        uiTransform={{
          width: '80%',
          height: '85%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
        }}
      >
        {/* track info title and artist */}
    <UiEntity
        uiTransform={{
          width: '97%',
          height: '60%',
          display: 'flex',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
        }}
      >

        <UiEntity
        uiTransform={{
          width: '80%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'flex-start',
        }}
      >

    <UiEntity
        uiTransform={{
          width: '100%',
          height: '40%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          margin:{bottom:'1%'}
        }}
        uiText={{textWrap:'nowrap', value:"" + (data.data.title.length > 25 ? data.data.title.substring(0,25) + "..." : data.data.title), color:Color4.Gray(), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
      />

<UiEntity
        uiTransform={{
          width: '100%',
          height: '40%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + data.data.user, color:Color4.Gray(), fontSize:sizeFont(20,15), textAlign:'middle-left'}}
      />

      </UiEntity>

      <UiEntity
        uiTransform={{
          width: '20%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
        }}
      >

<UiEntity
        uiTransform={{
          width: '65%',
          height: '65%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
        }}
        uiBackground={{
            textureMode: 'stretch',
              texture: {
                  src: currentTrack.playing && currentTrack.pointer === (((visiblePage - 1)* 3) + data.count) ? resources.textures.audiusPauseButton : resources.textures.audiusPlayButton,
              },
              uvs: getImageAtlasMapping(resources.uvs.audiusPlayButton)
          }}
          onMouseDown={()=>{
            setUIClicked(true)
            console.log('current rack is', currentTrack)
            if(currentTrack.playing){
                pausePlayer()
                if(currentTrack.pointer !== ((visiblePage -1) * 3) + data.count){
                    playTrendingTrack(((visiblePage -1) * 3) + data.count)
                }
            }else{
              console.log('playing new trending item',currentTrack.pointer = ((visiblePage -1) * 3) + data.count)
                if(currentTrack.pointer !== ((visiblePage -1) * 3) + data.count){
                    playTrendingTrack(((visiblePage -1) * 3) + data.count)
                }else{
                    playTrack()
                }
            }
          }}
          onMouseUp={()=>{
            setUIClicked(false)
          }}
      />
        </UiEntity>

      </UiEntity>

 {/* track metadata and likes */}
        <UiEntity
        uiTransform={{
          width: '97%',
          height: '40%',
          display: 'flex',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
        }}
      >

    <UiEntity
        uiTransform={{
          width: '33%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + data.data.reposts + " reposts", color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
      />

<UiEntity
        uiTransform={{
          width: '33%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + data.data.favorites + " favorites", color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
      />

<UiEntity
        uiTransform={{
          width: '33%',
          height: '100%',
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
        }}
        uiText={{textWrap:'nowrap', value:"" + formatDollarAmount(data.data.plays) + " plays", color:Color4.Gray(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
      />

      </UiEntity>

      </UiEntity>

      </UiEntity>
    )
}

async function chooseCategory(category:string){
    selectedCategory = category
    if(category === "Trending"){
        visibleItems.length = 0
        moodIndex = 0
        moodsView = "main"
        loading = true
        await getTrending()
        refreshVisibleItems(3)
        loading = false
    }else{

    }
}

function refreshVisibleItems(perPage?:number, list?:any[]){
  console.log('refreshing visible items', perPage, list)
    visibleItems = paginateArray(list ? list : [...currentPlaylist], visiblePage, perPage ? perPage : 6)
    console.log('visible items ar enow', visibleItems)
}

async function getTrending(){
    try{    
        let res = await fetch(server + "/" + resources.audius.endpoints.trending + "&app_name=" + APP_NAME)
        let json = await res.json()

      console.log('init player json is', json)
      if(json.data.length > 0){
        cleanseData(json.data)
      }
      retries = 0
    }
      catch(e){
        console.log('error fetching trending, try again')
        // retry(()=>{chooseCategory('Trending')})
      }
}

function retry(func:any){
    retries++
    if(retries < 5){

    }
}

function cleanseData(data:any){
    data.forEach((item:any)=>{
        let artwork = ""
        if(item.artwork['150x150']){
          artwork = item.artwork['150x150']
        }else if(item.artwork['480x480']){
          artwork = item.artwork['480x480']
        }
        else if(item.artwork['1000x1000']){
          artwork = item.artwork['1000x1000']
        }else{

        }
        currentPlaylist.push({
            image: artwork, 
            title: item.title, 
            duration: item.duration, 
            mood: item.mood, 
            favorites: item.favorite_count, 
            reposts: item.repost_count, 
            plays: item.play_count, 
            user: item.user.name,
            handle: item.user.handle,
            id: item.id
        })
    })
}

function playTrendingTrack(id:number){
  console.log("playing trending track", id)
    currentTrack.pointer = id
    attemptToPlayTrack()
}

async function attemptToPlayTrack(){
    console.log('current track is', currentTrack)
    if(shuffle){
        currentTrack.pointer = getRandomIntInclusive(0, currentPlaylist.length-1)
    }
    else if(repeat){
        currentTrack.pointer -=1
    }

    let track = await fetchTrackInfo(currentPlaylist[currentTrack.pointer].id)
    if(track){
        console.log('track info to play is', track)
        currentTrack.time = 0

        await updatePlayer(track.user.name, track.title, track.duration, track.user.handle, track.artwork['150x150'], track.id)
        playTrack()
    }
}

export async function fetchTrackInfo(id:string){
    console.log('fetching track info', server + "/" + resources.audius.endpoints.trackInfo + "/" + id + "?app_name=" + APP_NAME)
    let res = await fetch(server + "/" + resources.audius.endpoints.trackInfo + "/" + id + "?app_name=" + APP_NAME)
    let json = await res.json()
    console.log('track about to play info is', json)
    return json.data
}

export async function updatePlayer(artist:string, trackTitle:string, trackDuration:number, artistHandle:string, image:string, id:string){
    currentTrack.artist = artist
    currentTrack.title = trackTitle
    currentTrack.duration = trackDuration
    currentTrack.image = image
    currentTrack.id = id
    currentTrack.link = server + "/" + resources.audius.endpoints.stream + "/" + id + "/stream?app_name=" + APP_NAME + "&t=" +Math.floor(Date.now()/1000)
  
    console.log('about to play track', currentTrack)
    AudioStream.createOrReplace(streamEntity,{
      url: currentTrack.link,
      playing: false,
      volume: currentTrack.volume
    })
  
    if(prevArtist !== artist){
      await updateArtistInfo(artistHandle)
    }
  }

export function pausePlayer(){
    currentTrack.playing = false
    if(AudioStream.has(streamEntity)){
      let mixer = AudioStream.getMutable(streamEntity)
      mixer.playing = false
    }
}

export function playTrack(){
  console.log('playing track')
  if(!currentTrack.link || currentTrack.link === ""){
    attemptToPlayTrack()
    return
  }
    let mixer = AudioStream.getMutableOrNull(streamEntity)
    if(!mixer){
      AudioStream.createOrReplace(streamEntity,{
        url: currentTrack.link,
        playing: true,
        volume: currentTrack.volume
      })
    }else{
      mixer.playing = true
    }
    currentTrack.playing = true
}

export async function updateArtistInfo(handle:string){
    let res = await fetch(server + "/" + resources.audius.endpoints.artist +  handle + "?app_name=" + APP_NAME)//
    let json = await res.json()
    console.log('artist info is', json)//
    if(json.data && json.data.length > 0){
      let artistInfo = json.data[0]
      prevArtist = artistInfo.name
  
    //   currentArtist.cover = server + "/" + (artistInfo.cover_photo ? artistInfo.cover_photo['640x'] : options.coverbg['cover'+ getRandomIntInclusive(1,1)])
      currentArtist.profile = server + "/" + (artistInfo.profile_picture ? artistInfo.profile_picture['150x150'] : artistInfo.profile_picture['480x480'] ? artistInfo.profile_picture['1000x1000'] : "")
      currentArtist.handle = artistInfo.handle
      currentArtist.name = artistInfo.name
      currentArtist.bio = artistInfo.bio ? artistInfo.bio : "No Bio"
      currentArtist.trackCount = artistInfo.track_count
      currentArtist.followers = artistInfo.follower_count
      currentArtist.following = artistInfo.followee_count
  
      console.log('current aritst is now', currentArtist)
    }
}

export async function attemptRewind(){
    console.log("attemping rewind", currentTrack.index)
    currentTrack.pointer -= 1
    if(currentTrack.pointer < 0){
        currentTrack.pointer = 0
    }
    else{
      attemptToPlayTrack()
    }
}

export async function attemptSeek(){
    console.log("attemping seek", currentTrack.pointer)
    currentTrack.pointer += 1
    if(currentTrack.pointer >= currentPlaylist.length){
        console.log("cannot seek further")
        currentTrack.pointer -= 1
    }
    else{
        console.log('player index', currentTrack.pointer)
        attemptToPlayTrack()
    }
}

export function updateVolume(amount:number){
  currentTrack.volume += amount / 100
  if(currentTrack.volume < 0){
    currentTrack.volume = 0
  }

  if(currentTrack.volume > 1){
    currentTrack.volume = 1
  }

  let mixer = AudioStream.getMutable(streamEntity)
  mixer.volume = currentTrack.volume
}