import { Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Transform, VideoPlayer, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

let scene:any = {
    "id": "oUgtG",
    "n": "Test Export Scene",
    "d": "Test Export Scene",
    "o": "0xaabe0ecfaf9e028d63cf7ea7e772cf52d662691a",
    "ona": "BuilderWorld",
    "cat": "",
    "bpcl": "0,0",
    "w": "BuilderWorld.dcl.eth",
    "im": "",
    "bps": [],
    "pcls": [
      "0,0",
      "1,0",
      "1,1",
      "0,1"
    ],
    "sp": [
      "16,16"
    ],
    "ass": [
      {
        "name":"Item Name",
        "id": "e6991f31-4b1e-4c17-82c2-2e484f53a123",
        "aid": "vBXS97",
        "type": "2D",
        "p": {
          "x": 16,
          "y": 0,
          "z": 16
        },
        "r": {
          "x": 90,
          "y": 0,
          "z": 0
        },
        "s": {
          "x": 32,
          "y": 32,
          "z": 1
        },
        "comps": [
          "Transform",
          "Visibility",
          "Image",
          "Material"
        ],
        "visComp": {
          "visible": true
        },
        "matComp": {
          "shadows": true,
          "metallic": 0,
          "roughness": 1,
          "intensity": 0,
          "emissPath": "",
          "emissInt": 0,
          "textPath": "",
          "color": [
            "1",
            "1",
            "1",
            "1"
          ]
        },
        "imgComp": {
          "url": "https://bafkreihxmbloqwqgjljwtq4wzhmo5pclxavyedugdafn2dhuzghgpszuim.ipfs.nftstorage.link/"
        }
      }
    ],
    "cd": 1702650735,
    "upd": 1702650735,
    "si": 0,
    "toc": 0,
    "pc": 0,
    "pcnt": 4,
    "isdl": false,
    "e": true
  }

export let sceneParent:Entity

export function initIWBScene(){
    createParent()
    createSceneItems()
}

function createParent(){
    sceneParent = engine.addEntity()
     const [x1, y1] = scene.bpcl.split(",")
     let x = parseInt(x1)
     let y = parseInt(y1)
 
     Transform.create(sceneParent, {
         position: Vector3.create(x*16, 0, y*16)
     })
}

function createSceneItems(){
    scene.ass.forEach((item:any)=>{
        let entity = engine.addEntity()
        Transform.create(entity, {parent:sceneParent, position:item.p, rotation:Quaternion.fromEulerDegrees(item.r.x, item.r.y, item.r.z), scale:item.s})
        addAssetComponents(entity, item, item.type, item.n)
    })
}

function addAssetComponents(entity:Entity, item:any, type:string, name:string){

    switch(type){
        case '3D':
            createGltfComponent(entity, item)
            break;

        case '2D':
            MeshRenderer.setPlane(entity)
            MeshCollider.setPlane(entity)
            
            switch(name){
                case 'Image':
                    updateImageUrl(entity, item.aid, item.matComp, item.imgComp.url)
                    break;

                case 'Video':
                    createVideoComponent(entity, item)
                    break;
            }
            break;

        case 'Audio':
            break;
    }
}

function createGltfComponent(entity:Entity, item:any){
    let gltf:any = {
        src:"assets/" + item.id + ".glb",
        invisibleMeshesCollisionMask: item.colComp && item.colComp.iMask ? item.colComp && item.colComp.iMask : undefined,
        visibleMeshesCollisionMask: item.colComp && item.colComp.vMask ? item.colComp && item.colComp.vMask : undefined
    }
    GltfContainer.create(entity, gltf)
}

function updateImageUrl(entity:Entity, aid:string, materialComp:any, url:string){
    let texture = Material.Texture.Common({
        src: "" + url
    })
    
    Material.setPbrMaterial(entity, {
        metallic: parseFloat(materialComp.metallic),
        roughness:parseFloat(materialComp.roughness),
        specularIntensity:parseFloat(materialComp.intensity),
        emissiveIntensity: materialComp.emissPath !== "" ? parseFloat(materialComp.emissInt) : undefined,
        texture: texture,
        emissiveTexture: materialComp.emissPath !== "" ? materialComp.emissPath : undefined
        })
}

function createVideoComponent(entity:Entity, item:any){
    VideoPlayer.create(entity, {
        src: item.vidComp.url,
        playing: item.vidComp.autostart,
        volume: item.vidComp.volume,
        loop: item.vidComp.loop
    })

    const videoTexture = Material.Texture.Video({ videoPlayerEntity: entity })

    Material.setPbrMaterial(entity, {
        texture: videoTexture,
        roughness: 1.0,
        specularIntensity: 0,
        metallic: 0,
        emissiveColor:Color4.White(),
        emissiveIntensity: 1,
        emissiveTexture: videoTexture
    })
}