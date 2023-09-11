import { engine, InputAction, inputSystem, Material, MeshCollider, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'


import { bounceScalingSystem, circularSystem } from './systems'

import { setupUi } from './ui'
import { BounceScaling, Spinner } from './components'
import { createCube } from './factory'
import { getUserData, GetUserDataResponse } from '~system/UserIdentity'
import { NetworkManager } from './nm'
import { Client } from 'colyseus.js'
import { getRealm } from '~system/Runtime'
import { connect } from './connection'

// Defining behavior. See `src/systems.ts` file.
engine.addSystem(circularSystem)
engine.addSystem(bounceScalingSystem)

export function main() {
  // draw UI
  setupUi()

  init()
}


function init(){

  //let userdata = await getUserData({})
//
  // connectionColyseus(userdata)
  connect("angzaar_room").then((room) => {
    console.log("Connected!");
    // connectedRoom = room;

    //
    // -- Colyseus / Schema callbacks --
    // https://docs.colyseus.io/state/schema/
    //

    // room.state.enemies.onAdd = (enemy: Enemy, i: number) => {
    //     log("room.state.enemies.onAdd", "ENTRY")
    //     lastEnemy = spawnEnemy(enemy.position.x, enemy.position.y, enemy.position.z, enemy.entityId);
    // };

    // room.state.enemies.onRemove = (enemy: Enemy, i: number) => {
    //     log("room.state.enemies.onRemove", "ENTRY")
    // };

    // room.state.players.onAdd = (player: any, sessionId: string) => {
    // }
    // room.state.players.onRemove = () => {
    // }

    // room.state.crystals.onAdd = (crystal: EnergyCrystal) => {
    //     createEnergyCrystal(
    //         Vector3.create(crystal.position.x, crystal.position.y, crystal.position.z), crystal.index)
    // }


    // // Beacons
    // room.state.beaconHealths.onAdd = (energyLevel: number, i: number) => {
    //     log("room.beaconHealths.onAdd", "ENTRY", energyLevel)
    //     allBeacons[i].setEnergy(energyLevel)
    // }

    // room.state.beaconHealths.onChange = (changeValue: number, i: number) => {
    //     log("room.beaconHealths.onChange", "ENTRY", changeValue, i)
    //     allBeacons[i].setEnergy(changeValue)
    // }

    // // Enemies
    // room.onMessage("enemy-damaged", (data:{entityId: string, damage:number}) => {
    //     log("room.onMessage.enemy-damaged", "ENTRY", data.entityId)
    //     damageEnemy(data.entityId, data.damage)

    // });
    // room.onMessage("enemy-destroyed", (entityId: string) => {
    //     log("room.onMessage.enemy-destroyed", "ENTRY", entityId)
    //     destroyEnemy(entityId)
    //     ammoBar.increase(.05)
    // });


    // // Energy
    // room.onMessage("add-energy", (beaconId: number) => {
    //     log("room.onMessage.add-energy", "ENTRY", beaconId)
    //     if(!allBeacons[beaconId]) return;
    //     allBeacons[beaconId].addEnergy(1)
    // });
    // room.onMessage("remove-energy", (beaconId: number) => {
    //     log("room.onMessage.remove-energy", "ENTRY", beaconId)
    //     if(!allBeacons[beaconId]) return;
    //     allBeacons[beaconId].removeEnergy(1)
    // });
    // room.onMessage("collect-energy-crystal", (crystalId: number) => {
    //     log("room.onMessage.collect-energy-crystal", "ENTRY", crystalId)
    //     removeCrystal(crystalId)
    // });
    // room.onMessage("create-energy-crystal", (crystal: EnergyCrystal) => {
    //     createEnergyCrystal(
    //         Vector3.create(crystal.position.x, crystal.position.y, crystal.position.z), crystal.index)
    // })


    // // Game
    // room.onMessage("initialize-game", (data: any) => {
    //     log("room.onMessage.initialize-game", "ENTRY", data)


    // });

    // room.state.listen("countdown", (num: number) => {
    //     log("countdown", num)
    //     //countdown.set(num);
    // })
    // room.state.listen("countdown", (num: number) => {
    //     log("countdown", num)
    //     setCountdown(num)
    // })
    // room.onMessage("start", () => {
    //     log("room.onMessage.start", "ENTRY")

    //     setZombiesForRound(0)
    //     Transform.getMutable(dreamForestDark).scale = Vector3.create(.99, .99, .99)
    //     Transform.getMutable(dreamForestLight).scale =  Vector3.Zero()

    //     for (const [entity] of engine.getEntitiesWith(wallComponent)) {
    //         Material.setPbrMaterial(entity, {
    //             texture: wallTexture,
    //             emissiveTexture: wallTexture,
    //             emissiveColor: Color4.White()
    //         })
    //     }
    //     playDark()
    //     initBeacons()
    //     //countdown.show();
    // });
    // room.onMessage("game-win", () => {
    //     log("room.onMessage.game-win", "ENTRY")

    //     Transform.getMutable(dreamForestDark).scale = Vector3.Zero()
    //     Transform.getMutable(dreamForestLight).scale = Vector3.create(.99, .99, .99)

    //     for (const [entity] of engine.getEntitiesWith(wallComponent)) {
    //         Material.setPbrMaterial(entity, {
    //             texture: wallTextureLight,
    //             emissiveTexture: wallTextureLight,
    //             emissiveColor: Color4.White()
    //         })
    //     }

    //     playLight()
    //     resetGame()

    // });

    // room.onMessage("game-lose", () => {
    //     log("room.onMessage.game-lose", "ENTRY")

    //     loseGame()
    //     resetGame()
    // });

    // room.onMessage("finished", () => {
    //     try {
    //         //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);

    //     } catch (e) {
    //         console.log("room.onMessage.finished", "caught error", e)
    //         console.error(e)
    //     }
    //     // countdown.hide();
    // });
    // room.onMessage("restart", () => {
    //    // playOnce(countdownRestartSound);
    //     resetGame()
    //     setZombiesForRound(0)
    //     initBeacons()
    //     for (const [entity] of engine.getEntitiesWith(wallComponent)) {
    //         Material.setPbrMaterial(entity, {
    //             texture: wallTexture,
    //             emissiveTexture: wallTexture,
    //             emissiveColor: Color4.White()
    //         })
    //     }

    //     Transform.getMutable(dreamForestDark).scale = Vector3.create(.99, .99, .99)
    //     Transform.getMutable(dreamForestLight).scale =  Vector3.Zero()

    //     playDark()
    // });

    // room.onLeave((code) => {
    //     log("onLeave, code =>", code);
    // });

}).catch((err) => {
    //error(err);
    console.error(err)

});
}
