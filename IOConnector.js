const Constants = require('./constants')
const {generateRandomString} = require("./helpers");
const ChessDatabase = require("./db");
// const {aws4} = require("mongodb/src/deps");

// TODO: too many players
// TODO: sanitize
// TODO: concurrency?

class IOConnector {
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

    /**
     * Return opponent from this.waiting and delete it from this.waiting
     *
     * @param color
     * @returns {null}
     */
    getOpponent(color) {
        let opponent = null
        //this.waiting.forEach((player) => {
        for (const [_, player] of this.waiting.entries()) {
            if(this.opponentsByColor[color].includes(player.color)) {
                opponent = {...player};
                this.waiting.delete(player.playerId)
                break
            }
        }

        return opponent
    }

    normalizeColors(player, opponent) {
        if(player.color === Constants.COLOR_ANY && opponent.color === Constants.COLOR_ANY) {
            player.color = Constants.COLOR_WHITE
        }

        if(player.color === Constants.COLOR_ANY) {
            player.color = this.oppositeColor(opponent.color)
        }

        if(opponent.color === Constants.COLOR_ANY) {
            opponent.color = this.oppositeColor(player.color)
        }

        return {
            player: player,
            opponent: opponent
        }
    }

    oppositeColor(color) {
        return color === Constants.COLOR_WHITE ? Constants.COLOR_BLACK : Constants.COLOR_WHITE
    }

    prepareGameForUser(game, player) {
        game.myColor = player.color
        game.players = null
        game.enemyColor = this.oppositeColor(player.color)
        game.playerId = player.playerId

        return game
    }

    process() {
        this.io.on('connection', async (socket) => {
            const DB = new ChessDatabase()
            await DB.connect()

            socket.on('newPlayer', async (data) => {
                console.log(`Waiting: ${this.waiting.size}`)
                let player = this.createPlayer(data, socket.id)
                let opponent = this.getOpponent(data.color)
                if (!opponent) {
                    console.log(`Opponent not found, set current player to wait: ${JSON.stringify(player)}`)
                    this.waiting.set(player.playerId, {...player})
                } else {
                    // TODO check unique
                    const normalColors = this.normalizeColors(player, opponent)
                    const game = JSON.parse(JSON.stringify(Constants.DEFAULT_GAME))
                    game.players = [normalColors.player, normalColors.opponent]
                    const gameId = await DB.createGame(game)

                    const gameCopyPlayer = JSON.parse(JSON.stringify(game));
                    gameCopyPlayer.canMove = player.color === Constants.COLOR_WHITE
                    this.emitGameToPlayer(player, gameCopyPlayer)

                    const gameCopyOpponent = JSON.parse(JSON.stringify(game));
                    gameCopyOpponent.canMove = opponent.color === Constants.COLOR_WHITE
                    this.emitGameToPlayer(opponent, gameCopyOpponent)

                    console.log(`Game ${gameId} is created between ${JSON.stringify(player)} and ${JSON.stringify(opponent)}`)
                }
            })

            socket.on('updateGame', async (data) => {
                const game = await DB.findGame(data._id)
                game.positions = JSON.parse(JSON.stringify(data.positions))
                await DB.updateGame(data._id, game)

                const opponent = game.players.filter((element) => {
                    return element.playerId !== data.playerId
                })[0]

                const gameCopy = JSON.parse(JSON.stringify(game));
                gameCopy.canMove = true

                this.emitGameToPlayer(opponent, gameCopy)

                console.log(`Game ${data._id} is updated`)
            })

            socket.on('cancelGame', async data => {
                const game = await DB.findGame(data._id)
                if(!game) {
                    return
                }
                console.log(`Game ${game._id} is canceled`)
                const opponent = game.players.filter((element) => {
                    return element.playerId !== data.playerId
                })[0]
                this.io.to(opponent.connectionId).emit('cancelGame', data._id)
                await DB.deleteGame(data._id)
            })

            socket.on('disconnect', async () => {
                const game = await DB.findGameBySocketId(socket.id)
                if(!game) {
                    return
                }
                const player = game.players.filter((element) => {
                    // players.connectionId
                    return element.connectionId === socket.id
                })[0]
                const opponent = game.players.filter((element) => {
                    // players.connectionId
                    return element.connectionId !== socket.id
                })[0]
                this.io.to(opponent.connectionId).emit('cancelGame', game._id)
                await DB.deleteGame(game._id)
                console.log(`User disconnected: ${socket.id}`)
            })
        })
    }

    createPlayer(data, connectionId) {
        return {
            connectionId,
            playerId: data.playerId,
            color: data.color,
        }
    }

    updateGame(gameForUser) {
        const game = this.games.get(gameForUser.gameId)
        game.positions = gameForUser.positions
        this.games.set(gameForUser.gameId, game)
    }

    emitGameToPlayer(player, game) {
        const userGame = this.prepareGameForUser(game, player)
        this.io.to(player.connectionId).emit('game', userGame)
    }

}

module.exports = IOConnector;
