import { EasingFunction, InputAction, Material, MeshCollider, MeshRenderer, Transform, Tween, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { utils } from "../../../helpers/libraries";
import { Enemy, Wave, WaveSpawnDelayTypes, WaveStartTypes } from "../../../helpers/types";
import { Color4, Matrix } from "@dcl/sdk/math";
import { EnemyComponent } from "../../../helpers/Components";
import { WaveEntityEndTweenSystem } from "../../systems/GameSystems";
import { getDistance, getRandomIntInclusive } from "../../../helpers/functions";
import { currentGame } from "./playing";
import { changeNumber } from "./actions";
import { scoreUI } from "../../../ui/gaming/scoreUI";


export function startGameWaves(waves:Wave[]){
    console.log('starting waves for level', waves)
    engine.addSystem(WaveEntityEndTweenSystem)

    waves.forEach((wave:Wave)=>{
        if(wave.sTy === WaveStartTypes.LEVEL_START){
            wave.spawned = 0
            setWaveTimeout(wave)
        }
    })
}

function setWaveTimeout(wave:Wave){
    let delay:any

    if(wave.spwnDelTy === WaveSpawnDelayTypes.RANDOM){
        let split = wave.spwnDelRng!.split("-")
        let range = [parseInt(split[0]), parseInt(split[1])]
        delay = getRandomIntInclusive(range[0], range[1])
    }else{
        delay = (wave.spwnDel ? wave.spwnDel : 0)
    }

    wave.timeout = utils.timers.setTimeout(()=>{
        releaseWave(wave)
    }, 1000 * delay)
}

export function releaseWave(wave:Wave){
    console.log('releasing wave', wave)
    utils.timers.clearTimeout(wave.timeout)

    if(wave.spawned! < wave.spwnAmt){
        wave.spawned! += 1
        spawnWaveObject(wave)
        setWaveTimeout(wave)
    }else{
        endWave(wave)
    }
}

export function spawnWaveObject(wave:Wave){
    let enemy = wave.enmy
    let scale = wave.enmy.si

    let start = wave.starts[0]
    let end = wave.ends[0]

    let ent = engine.addEntity()
    MeshRenderer.setBox(ent)
    MeshCollider.setBox(ent)

    //for testing1
    switch(enemy.cid){
        case 'blue':
            Material.setPbrMaterial(ent, {
                albedoColor: Color4.Blue(),
                metallic: 0.8,
                roughness: 0.1,
              })
            break;

        case 'green':
            Material.setPbrMaterial(ent, {
                albedoColor: Color4.Green(),
                metallic: 0.8,
                roughness: 0.1,
              })
            break;
        
        case 'teal':
            Material.setPbrMaterial(ent, {
                albedoColor: Color4.Teal(),
                metallic: 0.8,
                roughness: 0.1,
              })
            break;
    }

    Transform.create(ent, {position: start, scale:scale})
    EnemyComponent.create(ent)

    let distance = getDistance(end, start)

    Tween.createOrReplace(ent, {
        mode: Tween.Mode.Move({
        start: start,
        end: end,
        }),
        duration: 1000 * (distance / (enemy.as ? enemy.as : 1)),
        easingFunction: EasingFunction.EF_LINEAR,
    })

    pointerEventsSystem.onPointerDown({entity:ent,
        opts:{showFeedback:true, hoverText:"click me", button:InputAction.IA_POINTER, maxDistance:30}
    },
    ()=>{
        console.log('clicked enemy')
        engine.removeEntity(ent)
        changeNumber(currentGame.currentLevel!.score!, 1, scoreUI)
        //play sound
    })
}

export function endWave(wave:Wave){
    console.log('end wave', wave)
    utils.timers.clearTimeout(wave.timeout)
}