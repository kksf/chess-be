const Repo = require('./Repo');
const PlayerEntity = require('../DTO/PlayerEntity');
const {ObjectId} = require("mongodb");
const GameEntity = require("../DTO/GameEntity");
const Constants = require("../constants");

class PlayerRepo extends Repo {
    collectionName = 'players'

    async createPlayer(data, socketId) {
        console.log('createPlayer', data)
        await this.connect()
        this.entity = new PlayerEntity()
        this.entity.socketId = socketId
        this.entity.myColor = data.color
        this.entity.canMove = false
        this.entity.dateCreated = new Date()
        await this.insert()
    }

    async updatePlayer(id, newData) {
        await this.connect()
        newData.dateUpdated = new Date()
        await this.patch(id, newData)
    }

    async findWaitingByColorsAndIdNe(colors, id) {
        return await this.collection.findOne({
            myColor: { $in: colors },
            gameId: null,
            _id: { $ne: new ObjectId(id) }
        })
    }

    async findBySocketId(socketId) {
        const entity = await this.collection.findOne({ socketId: socketId })
        if( ! entity) {
            throw new Error(`Entity with socketId ${socketId} not found in ${this.collectionName} collection`)
        }

        return entity
    }
}

module.exports = PlayerRepo;