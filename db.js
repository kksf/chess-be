const { MongoClient, ObjectId } = require("mongodb");

class ChessDatabase {
    collection

    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess');
    }

    async connect() {
        await this.client.connect();
        this.database = this.client.db(process.env.MONGODB_DBNAME || 'chess');
        this.collection = this.database.collection("games");
    }

    async close() {
        await this.client.close();
    }


    async savePlayer(playerEntity){
        if(playerEntity._id) {
            const playerEntityOld = await this.collection.findOne({ _id: new ObjectId(playerEntity._id) });
            if( ! playerEntityOld) {
                throw new Error(`Player with id ${playerEntity._id} not found`)
            }
            await this.collection.updateOne({ _id: new ObjectId(playerEntity._id) }, { $set: {...playerEntityOld, ...playerEntity} })
            return playerEntity._id
        } else {
            const result = await this.collection.insertOne(playerEntity)
            return result.insertedId
        }
    }





    async createGame(data) {
        data.dateCreated = new Date();
        const result = await this.collection.insertOne(data);
        return result.insertedId;
    }

    async updateGame(id, data) {
        data.dateUpdated = new Date();
        await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    }

    async deleteGame(id) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    async findGame(id) {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });

        return result || null;
    }

    async findGameBySocketId(socketId) {
        const result = await this.collection.findOne({ 'players.connectionId': socketId });

        return result || null;
    }
}

module.exports = ChessDatabase;
