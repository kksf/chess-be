const Constants = require('./constants')
const {cloneObject} = require("./helpers")
const PlayerRepo = require("./repo/PlayerRepo")
const GameRepo = require("./repo/GameRepo")
const UserGameDTO = require("./DTO/UserGameDTO")

// TODO: too many players
// TODO: sanitize
// TODO: concurrency?

class Game {
    io
    waiting = new Map()
    opponentsByColor = {
        [Constants.COLOR_WHITE]: [Constants.COLOR_BLACK, Constants.COLOR_ANY],
        [Constants.COLOR_BLACK]: [Constants.COLOR_WHITE, Constants.COLOR_ANY],
        [Constants.COLOR_ANY]: [Constants.COLOR_WHITE, Constants.COLOR_BLACK, Constants.COLOR_ANY],
    }
    games = new Map()

    constructor(io) {
        this.io = io
    }

    process() {
        this.io.on('connection', async (socket) => {
            socket.on('ping', async data => {
                const playerRepo = new PlayerRepo()
                await playerRepo.updatePlayer(data.playerId, {socketId: socket.id})
                console.log(`PING from playerId: ${data.playerId} on socket: ${socket.id}`)
            })

            socket.on('newPlayer', async (data) => {
                console.log(`New player: ${JSON.stringify(data)}`)

                // Create player and save it to DB
                const playerRepo = new PlayerRepo()
                await playerRepo.createPlayer(data, socket.id)
                let playerEntity = playerRepo.getEntity()
                console.log(`Player: ${JSON.stringify(playerEntity)}`)
                this.io.to(playerEntity.socketId).emit('playerCreated', playerEntity)


                // Find opponent by color
                const opponentRepo = new PlayerRepo()
                await opponentRepo.connect()
                let opponentEntity = await opponentRepo.findWaitingByColorsAndIdNe(this.opponentsByColor[playerEntity.myColor], playerEntity._id)
                console.log(`Opponent: ${JSON.stringify(opponentEntity)}`)

                if (opponentEntity) {
                    // create game and save it to DB
                    const gameRepo = new GameRepo()
                    await gameRepo.createGame({players: [playerEntity._id, opponentEntity._id]})
                    const gameEntity = gameRepo.getEntity()

                    // reduce colors to 2 options
                    const normalColors = this.normalizeColors(playerEntity.myColor, opponentEntity.myColor)

                    // update the player in DB
                    await playerRepo.updatePlayer(playerEntity._id, {
                        myColor: normalColors.playerColor,
                        enemyColor: normalColors.opponentColor,
                        canMove: normalColors.playerColor === Constants.COLOR_WHITE,
                        gameId: gameEntity._id,
                    })
                    playerEntity = playerRepo.getEntity()

                    // update the opponent in DB
                    await opponentRepo.updatePlayer(opponentEntity._id, {
                        myColor: normalColors.opponentColor,
                        enemyColor: normalColors.playerColor,
                        canMove: normalColors.opponentColor === Constants.COLOR_WHITE,
                        gameId: gameEntity._id,
                    })
                    opponentEntity = opponentRepo.getEntity()

                    console.log('playerEntity', playerEntity)
                    console.log('opponentEntity', opponentEntity)
                    // emit game to the player
                    const playerGame = this.prepareGameForPlayer(cloneObject(gameEntity), playerEntity)
                    this.io.to(playerEntity.socketId).emit('game', playerGame)

                    // emit same game to the opponent
                    const opponentGame = this.prepareGameForPlayer(cloneObject(gameEntity), opponentEntity)
                    this.io.to(opponentEntity.socketId).emit('game', opponentGame)

                    console.log(`Game ${gameEntity._id} is created between ${JSON.stringify(playerEntity)} and ${JSON.stringify(opponentEntity)}`)
                }
            })

            socket.on('updateGame', async (userGame) => {
                const gameRepo = new GameRepo()
                await gameRepo.updateGame(userGame.gameId, {
                    positions: userGame.positions,
                    piecesTaken: userGame.piecesTaken
                })
                const gameEntity = gameRepo.getEntity()

                const playerRepo = new PlayerRepo()
                await playerRepo.updatePlayer(userGame.playerId, {canMove: false})

                const opponentId = gameEntity.players.find(playerId => playerId.toString() !== userGame.playerId)

                const opponentRepo = new PlayerRepo()
                await opponentRepo.updatePlayer(opponentId, {canMove: true})
                const opponentEntity = opponentRepo.getEntity()

                const opponentGame = this.prepareGameForPlayer(cloneObject(gameEntity), opponentEntity)
                this.io.to(opponentEntity.socketId).emit('game', opponentGame)
                console.log(`Opponent is updated: ${JSON.stringify(opponentEntity)}`)

                console.log(`Game ${userGame.gameId} is updated`)
            })





            socket.on('cancelGame', async data => {
                // const game = await DB.findGame(data._id)
                // if(!game) {
                //     return
                // }
                //
                // const opponent = game.players.filter((element) => {
                //     return element.playerId !== data.playerId
                // })[0]
                // this.io.to(opponent.connectionId).emit('cancelGame', data._id)
                // await DB.deleteGame(data._id)
                console.log(`Game ${game._id} is canceled`)
            })

            socket.on('disconnect', async () => {
                // const game = await DB.findGameBySocketId(socket.id)
                // if(!game) {
                //     return
                // }
                // const player = game.players.filter((element) => {
                //     // players.connectionId
                //     return element.connectionId === socket.id
                // })[0]
                // const opponent = game.players.filter((element) => {
                //     // players.connectionId
                //     return element.connectionId !== socket.id
                // })[0]
                // this.io.to(opponent.connectionId).emit('cancelGame', game._id)
                // await DB.deleteGame(game._id)
                console.log(`User disconnected: ${socket.id}`)
            })
        })
    }

    prepareGameForPlayer(gameEntity, playerEntity) {
        const userGame = new UserGameDTO()
        userGame.myColor        = playerEntity.myColor
        userGame.enemyColor     = playerEntity.enemyColor
        userGame.playerId       = playerEntity._id
        userGame.gameId         = gameEntity._id
        userGame.canMove        = playerEntity.canMove
        userGame.positions      = gameEntity.positions
        userGame.piecesTaken    = gameEntity.piecesTaken

        return userGame
    }

    normalizeColors(playerColor, opponentColor) {
        if(playerColor === Constants.COLOR_ANY && opponentColor === Constants.COLOR_ANY) {
            playerColor = Constants.COLOR_WHITE
        }

        if(playerColor === Constants.COLOR_ANY) {
            playerColor = this.oppositeColor(opponentColor)
        }

        if(opponentColor === Constants.COLOR_ANY) {
            opponentColor = this.oppositeColor(playerColor)
        }

        return {playerColor, opponentColor}
    }

    oppositeColor(color) {
        return color === Constants.COLOR_WHITE ? Constants.COLOR_BLACK : Constants.COLOR_WHITE
    }


}

module.exports = Game;
