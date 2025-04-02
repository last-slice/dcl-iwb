import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { SOUND_TYPES } from "./types"

//npm run deploy -- --target-content https://worlds.dcl-iwb.co

export let colorsLabels:string[] = [
    "Black",
    "Blue",
    "Gray",
    "Green",
    "Magenta",
    "Purple",
    "Red",
    "Teal",
    "Yellow",
    "White",
]

export let colors:Color4[] = [
    Color4.Black(),
    Color4.Blue(),
    Color4.Gray(),
    Color4.Green(),
    Color4.Magenta(),
    Color4.Purple(),
    Color4.Red(),
    Color4.Teal(),
    Color4.Yellow(),
    Color4.White(),
]

export let audiusMoodEndpoints:any = {
    Chill:[
    "v1/full/playlists/top?limit=20&mood=peaceful&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=easygoing&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=melancholy&type=playlist&with_users=true",
    ],

    Upbeat:[
    "v1/full/playlists/top?limit=20&mood=upbeat&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=excited&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=energizing&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=empowering&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=cool&type=playlist&with_users=true",
    ],

    Intense:[
    "v1/full/playlists/top?limit=20&mood=rowdy&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=fiery&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=defiant&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=aggressive&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=gritty&type=playlist&with_users=true",
    ],

    Provoking:[
    "v1/full/playlists/top?limit=20&mood=sophisticated&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=brooding&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=serious&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=stirring&type=playlist&with_users=true",
    ],

    Intimate:[
    "v1/full/playlists/top?limit=20&mood=sentimental&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=romantic&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=yearning&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=sensual&type=playlist&with_users=true",
    "v1/full/playlists/top?limit=20&mood=tender&type=playlist&with_users=true",
    ],
}

export default {
    DEBUG: false,
    allowNoWeb3:false,

    slug:"in::world::builder::",

    lobby:"0x3edfae1ce7aeb54ed6e171c4b13e343ba81n-669b6",

    endpoints:{
        wsTest: "ws://localhost:2751",
        wsProd: "wss://dcl-iwb.co/toolset/qa",

        angzaarPlazaTest: "http://localhost:5353",
        angzaarPlazaProd: "https://angzaar-plaza.dcl-iwb.co/ws",

        deploymentTest: "http://localhost:3525",
        deploymentProd: "https://deployment.dcl-iwb.co",

        toolsetTest: "http://localhost:3000",
        toolsetProd: "https://dcl-iwb.co/toolset/qa",//

        questSystemTest: "ws://localhost:5335",
        questSystemProd:  "wss://angzaar-plaza.dcl-iwb.co/ws",

        validateTest: "http://localhost:2751",

        assetSign: "/scene/sign",
        dclNamesGraph:"https://subgraph.decentraland.org/marketplace",
        dclLandGraph:"https://subgraph.decentraland.org/land-manager",
        dclApi: "https://api.decentraland.org/v1/"
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
        opaqueGreen: Color4.create(0,1,0,0.4)
    },

    textures:{
        iwbLogo: "https://lsnft.mypinata.cloud/ipfs/QmdMHovmwDtjWyZURMKVXphZxLPsL6MVMrvd2fSBFMwM1o",
        atlas1:"assets/atlas1.png",
        atlas2:"assets/atlas2.png",
        audiusIcon:"https://lsnft.mypinata.cloud/ipfs/QmWTASViZ1XGXqeRqJJjdBgAr98rcDXbwurjhBHJNCBuBC",
        audiusPlayerBG:"https://lsnft.mypinata.cloud/ipfs/QmeegEEPVFzkfKErEXnKkLeq9ny26hQ5i35SBBT7yNPZGP",
        audiusPlayerCatBG:"https://lsnft.mypinata.cloud/ipfs/QmNbemMVip9GDfPARNqzmsjRFG1NKAvp7LFo5L6RswiA47",
        audiusPlayerNoSelectCatBG:"https://lsnft.mypinata.cloud/ipfs/QmYHV3h6zcAqzRQmJUnqjeRdLUtn9JdgneLtXaZzSCLNJb",
        audiusInfoPanelBG:"https://lsnft.mypinata.cloud/ipfs/QmQXXrRuLmGV2JDcpb5S34Wag2jqXJqJWSTN7UTqPudJr2",
        audiusTrendingItemBG:"https://lsnft.mypinata.cloud/ipfs/QmZvYkYC9gSFw3gveGG7jRs3vQnh2uF8PoFxYkRGYdYSxB",
        audiusPlayButton:"https://lsnft.mypinata.cloud/ipfs/QmRX4KUUJgfiBdJGiV1m77avWmTUo2naxsh4q3KNMhGQQe",
        audiusShuffleButton:"https://lsnft.mypinata.cloud/ipfs/QmZbNTAeZxaJDHefGDscjyz2hLHdG3692SY4X16oWLeekj",
        audiusShuffleButtonOn:"https://lsnft.mypinata.cloud/ipfs/QmYNNUQp8GCcaP2i1JbsR3STPjqExDai5D4WfF5LzhK4d2",
        audiusRewindButton:"https://lsnft.mypinata.cloud/ipfs/QmVf9tV7JDCM4oVtuUUKAksW6CvyPLCVC3yPLFLz1ymHK7",
        audiusSeekButton:"https://lsnft.mypinata.cloud/ipfs/QmPt7bxKndTR812mUAvcMqg9bXaTgxxoFxrHZy5T47mhwC",
        audiusRepeatButton:"https://lsnft.mypinata.cloud/ipfs/QmcDc7ketU77r2bgLCKm1FjRuSMpXxPkyLGX3wZserNTVh",
        audiusRepeatButtonOn:"https://lsnft.mypinata.cloud/ipfs/QmTYunrPsFcUefayKnMGijddBBt32n9AQFoyfA9iPBu9MS",
        audiusPauseButton:"https://lsnft.mypinata.cloud/ipfs/QmRP5gx5MRRPRKt7SsnmkQ58o5FZQnfJkmJKHuMBCVqF1c",
        audiusVolumeIcon:"https://lsnft.mypinata.cloud/ipfs/QmeiPHeTKJMEXtqE6T9gu9QGLgfLpAwtE39KYfZTjTScyf",
        audiusVolumeBG:"https://lsnft.mypinata.cloud/ipfs/QmPtkGm5ha9gfQii1M8F373pbaApKWijmz32c7dZcNsnY3",
        audiusVolumePill:"https://lsnft.mypinata.cloud/ipfs/QmaX5fLrNas9mmFyeqZk4415xdyyZvLy1pwbj3rM7jKRXa",
        audiusTrendingBG:"https://bafkreie5li7sqkrkwu3uviqtinlu5mpraim7bz3qna5xtwmzvqopxojx2q.ipfs.nftstorage.link/",
        audiusUndergroundBG:"https://bafkreic25ontlwqenzekgqgeba65rm2bxhfa5vrwuprfbmmispmglbm2f4.ipfs.nftstorage.link/",
        audiusFeelingLuckyBG:"https://bafkreicjywp36jp4fvechgnsxvvq2xo4lkxynelzcrregxqcijewxvttdy.ipfs.nftstorage.link/",
        audiusTopAlbums:"https://bafkreigscpgvfg5cjbhme7fkrv4ymgnlj27vvb6houxgv4q3pkmynoklku.ipfs.nftstorage.link/",
        audiusChillBG:"https://bafkreiedy4fqz7jdmnx4f24g242c4566nrajchxmxducllq6whjauzae5u.ipfs.nftstorage.link/",
        audiusUpbeatBG:"https://bafkreihsgnjerkmd44ctnekpltzjll3m5jwcup7ip2khwmujdffganeegu.ipfs.nftstorage.link/",
        audiusIntenseBG:"https://bafkreiekgmf7um3tvc4qxosn4ytm2vfa4do37kep45wykqpal3iekgkdhe.ipfs.nftstorage.link/",
        audiusProvokingBG:"https://bafkreib5e3pv2nmwdockgsbqybnu77p4bbjv45ay2o7ddt4bbyoyli3yrq.ipfs.nftstorage.link/",
        audiusIntimateBG:"https://bafkreidltzure7laiqpjlwzthzodrd2p3w4wwcrvw2wu76plz33und7c5y.ipfs.nftstorage.link/",
        audiusMoodBG:"https://lsnft.mypinata.cloud/ipfs/QmanXaAyUy4kVYVNaPK3JjaqubLJAL6kmgubNcEXwAELoc",
    },

    uvs:{
        audiusIcon:{
            atlasHeight: 128,
            atlasWidth: 128,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 128,
            sourceHeight: 128
        },
        audiusPlayerBG:{
            atlasHeight: 237,
            atlasWidth: 916,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 916,
            sourceHeight: 237
        },
        audiusPlayerCatBG:{
            atlasHeight: 35,
            atlasWidth: 161,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 161,
            sourceHeight: 35
        },
        audiusInfoPanelBG:{
            atlasHeight: 436,
            atlasWidth: 436,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 436,
            sourceHeight: 436
        },
        audiusTrendingItemBG:{
            atlasHeight: 194,
            atlasWidth: 856,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 856,
            sourceHeight: 194
        },
        audiusPlayButton:{
            atlasHeight: 93,
            atlasWidth: 93,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 93,
            sourceHeight: 93
        },
        audiusShuffleButton:{
            atlasHeight: 16,
            atlasWidth: 24,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 24,
            sourceHeight: 16
        },
        audiusRewindButton:{
            atlasHeight: 20,
            atlasWidth: 39,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 39,
            sourceHeight: 20
        },
        audiusSeekButton:{
            atlasHeight: 20,
            atlasWidth: 38,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 38,
            sourceHeight: 20
        },
        audiusRepeatButton:{
            atlasHeight: 23,
            atlasWidth: 24,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 24,
            sourceHeight: 23
        },
        audiusVolumeButton:{
            atlasHeight: 67,
            atlasWidth: 67,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 67,
            sourceHeight: 67
        },
        audiusVolumeBG:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
        audiusVolumePill:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
        audiusTrendingBG:{
            atlasHeight: 10,
            atlasWidth: 131,
            sourceTop: 0,
            sourceLeft: 0,
            sourceWidth: 131,
            sourceHeight: 10
        },
    },
    
    audioClips:[
        {key:SOUND_TYPES.ATMOS_BLESSING, name:"Blessing Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.WOOD_3, name:"Wood 3", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DOORBELL, name:"Doorbell Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DROP_1_STEREO, name:"Drop 1 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.SELECT_3, name:"Select 3 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.ERROR_2, name:"Error 2 Stereo", loop:false, attach:true, volume:.5},
    ],

    audius:{
        endpoints:{
            trending:"v1/tracks/trending?time=week&limit=45&offset=0",
            artist:"v1/full/users/handle/",
            stream:"v1/tracks",
            trendingPlaylists: "v1/playlists/trending",
            topalbums:"v1/full/playlists/top?limit=20&type=album&with_users=true",
            underground:"v1/full/tracks/trending/underground?limit=11&offset=0",
            playlistInfo: "v1/playlists",
            trackInfo:"v1/tracks",
            feelingLucky:"v1/full/tracks/feeling_lucky?limit=25&with_users=false",
            search:"v1/playlists/search?query=",
            searchTracks:"v1/tracks/search?query="
        },
        servers:[
            "https://audius-discovery-6.cultur3stake.com",
            "https://discovery.grassfed.network",
            "https://audius-discovery-2.theblueprint.xyz",
            "https://audius-discovery-15.cultur3stake.com",
            "https://audius-discovery-12.cultur3stake.com",
            "https://audius-discovery-11.cultur3stake.com",
            "https://dn2.monophonic.digital",
            "https://discovery-us-01.audius.openplayer.org",
            "https://dn-jpn.audius.metadata.fyi",
            "https://blockdaemon-audius-discovery-06.bdnodes.net",
            "https://audius-discovery-13.cultur3stake.com",
            "https://audius-metadata-5.figment.io",
            "https://dn1.matterlightblooming.xyz",
            "https://audius-metadata-4.figment.io",
            "https://audius-disco.ams-x01.nl.supercache.org",
            "https://audius-discovery-17.cultur3stake.com",
            "https://audius-discovery-8.cultur3stake.com",
            "https://blockdaemon-audius-discovery-07.bdnodes.net",
            "https://audius-metadata-3.figment.io",
            "https://audius-metadata-2.figment.io",
            "https://blockchange-audius-discovery-01.bdnodes.net",
            "https://blockchange-audius-discovery-03.bdnodes.net",
            "https://blockdaemon-audius-discovery-02.bdnodes.net",
            "https://audius-discovery-2.cultur3stake.com",
            "https://audius-discovery-18.cultur3stake.com",
            "https://audius-metadata-1.figment.io",
            "https://dn1.nodeoperator.io",
            "https://blockdaemon-audius-discovery-03.bdnodes.net",
            "https://blockchange-audius-discovery-02.bdnodes.net",
            "https://blockdaemon-audius-discovery-01.bdnodes.net",
            "https://audius-disco.dfw-x02.us.supercache.org",
            "https://audius-discovery-3.altego.net",
            "https://audius-discovery-3.cultur3stake.com",
            "https://dn1.monophonic.digital",
            "https://audius-discovery-4.cultur3stake.com",
            "https://audius-dp.amsterdam.creatorseed.com",
            "https://blockdaemon-audius-discovery-04.bdnodes.net",
            "https://audius-discovery-5.cultur3stake.com",
            "https://audius-discovery-10.cultur3stake.com",
            "https://audius-discovery-1.theblueprint.xyz",
            "https://audius-dp.singapore.creatorseed.com",
            "https://audius-discovery-4.theblueprint.xyz",
            "https://audius-discovery-9.cultur3stake.com",
            "https://dn-usa.audius.metadata.fyi",
            "https://disc-lon01.audius.hashbeam.com",
            "https://discoveryprovider.audius.co",
            "https://audius-discovery-1.altego.net",
            "https://blockdaemon-audius-discovery-08.bdnodes.net",
            "https://dn1.stuffisup.com",
            "https://audius-discovery-3.theblueprint.xyz",
            "https://audius-discovery-16.cultur3stake.com",
            "https://blockdaemon-audius-discovery-05.bdnodes.net",
            "https://discovery-au-02.audius.openplayer.org",
            "https://discoveryprovider2.audius.co",
            "https://audius.w3coins.io",
            "https://audius-discovery-14.cultur3stake.com",
            "https://audius-discovery-7.cultur3stake.com",
            "https://discoveryprovider3.audius.co",
            "https://audius-discovery-2.altego.net",
            "https://audius-discovery-1.cultur3stake.com",
            "creatornode.audius3.prod-us-west-2.staked.cloud"
          ]
    }
}

//