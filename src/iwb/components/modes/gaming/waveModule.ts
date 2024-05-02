import { EasingFunction, Material, MeshCollider, MeshRenderer, Transform, Tween, engine } from "@dcl/sdk/ecs";
import { utils } from "../../../helpers/libraries";
import { Enemy, Wave, WaveSpawnDelayTypes, WaveStartTypes } from "../../../helpers/types";
import { Color4 } from "@dcl/sdk/math";
import { EnemyComponent } from "../../../helpers/Components";
import { WaveEntityEndTweenSystem } from "../../systems/GameSystems";
import { getDistance } from "../../../helpers/functions";


export function startGameWaves(waves:Wave[]){
    console.log('starting waves for level', waves)
    engine.addSystem(WaveEntityEndTweenSystem)

    waves.forEach((wave:Wave)=>{
        if(wave.sTy === WaveStartTypes.LEVEL_START){
            wave.spawned = 0

            switch(wave.spwnDelTy){
                case WaveSpawnDelayTypes.CONSISTENT:
                    setWaveTimeout(wave)
                    break;

                case WaveSpawnDelayTypes.RANDOM:
                    break;
            }
        }
    })
}

function setWaveTimeout(wave:Wave){
    wave.timeout = utils.timers.setTimeout(()=>{
        releaseWave(wave)
    }, 1000 * (wave.spwnDel ? wave.spwnDel : 0))
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

    Tween.create(ent, {
        mode: Tween.Mode.Move({
        start: start,
        end: end,
        }),
        duration: 1000 * (distance / (enemy.as ? enemy.as : 1)),
        easingFunction: EasingFunction.EF_LINEAR,
    })
}

export function endWave(wave:Wave){
    console.log('end wave', wave)
    utils.timers.clearTimeout(wave.timeout)
}