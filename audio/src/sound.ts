import { engine, Transform, MeshCollider, InputAction, pointerEventsSystem, MeshRenderer, AudioSource, Entity } from '@dcl/sdk/ecs'


export const SceneSound = engine.addEntity()
MeshRenderer.setSphere(SceneSound)
MeshCollider.setBox(SceneSound)

AudioSource.create(SceneSound, {
    audioClipUrl: 'audio/sound4.mp3',
    playing: false
})
Transform.create(SceneSound, {
    position: { x: 115, y: 4, z: 185 },
    scale: { x: 5, y: 5, z: 5 },
  
});    
pointerEventsSystem.onPointerDown(
    {
      entity: SceneSound, opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'SceneSound'
      }
    }
    ,
    function () {
        playOneshot(BUTTONSound)
    

    }
  )




export const SceneSound2 = engine.addEntity()
    MeshRenderer.setSphere(SceneSound2)

AudioSource.create(SceneSound2, {
    audioClipUrl: 'audio/sound2.mp3',
    playing: false
})
Transform.create(SceneSound2, {
    position: { x: 158, y: 3, z: 116.8 },
    scale: { x: 5, y: 5, z: 5 },
  
});    

export const SceneSound3 = engine.addEntity()
MeshRenderer.setSphere(SceneSound3)

AudioSource.create(SceneSound3, {
    audioClipUrl: 'audio/sound3.mp3',
    playing: false
})
Transform.create(SceneSound3, {
    position: { x: 116, y: 45, z: 84.4 },
    scale: { x: 1, y: 1, z: 1 },
  
});    

export const BUTTONSound = engine.addEntity() // trigger sound 
MeshRenderer.setSphere(BUTTONSound)

AudioSource.create(BUTTONSound, {
    audioClipUrl: 'audio/sound1.mp3',
    playing: false,
    loop: false    /// doesnt loop 
    
})
Transform.create(BUTTONSound, {
    position: { x: 115, y: 1, z: 181.05 },
    scale: { x: 1, y: 1, z: 1 },
  
});    


export function playSound(entity: Entity){          // looping sound function 

    // fetch mutable version of audio source component
    const audioSource = AudioSource.getMutable(entity)
 
    // modify its playing value
    audioSource.playing = true,
    audioSource.loop = true    /// loops ! 

}


export function playOneshot(entity: Entity){   // One shot trigger sound function 

    // fetch mutable version of audio source component
    const audioSource = AudioSource.getMutable(entity)
 
    // modify its playing value
    audioSource.playing = true,
    audioSource.loop = false    // doesnt loop ! 

}


// call function
playSound(SceneSound)
playSound(SceneSound2)
playSound(SceneSound3)