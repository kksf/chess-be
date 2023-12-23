const Repo = require('./Repo');
const GameEntity = require('../DTO/GameEntity');
const Constants = require("../constants");

class GameRepo extends Repo {
    collectionName = 'games'

    async createGame(data) {
        await this.connect()
        this.entity = new GameEntity()
        this.entity.players = data.players
        this.entity.positions = JSON.parse(JSON.stringify(Constants.DEFAULT_POSITIONS))
        this.entity.dateCreated = new Date()
        await this.insert()
    }

    async updateGame(id, newData) {
        await this.connect()
        newData.dateUpdated = new Date()
        await this.patch(id, newData)
    }
}

module.exports = GameRepo