const { MongoClient, ObjectId } = require("mongodb");

class Repo {
    collectionName

    collection
    entity

    constructor() {
        this.db = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess');
    }

    async connect() {
        await this.db.connect();
        this.database = this.db.db(process.env.MONGODB_DBNAME || 'chess');
        this.collection = this.database.collection(this.collectionName);
    }

    async close() {
        await this.db.close();
    }

    async save() {
        if(this.entity._id) {
            await this.patch()
        } else {
            await this.insert()
        }
    }

    async insert() {
        const result = await this.collection.insertOne(this.entity)
        this.entity = await this.findById(result.insertedId)
    }

    async patch(id, data) {
        this.entity = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        )
    }

    async findById(_id) {
        const entity = await this.collection.findOne({ _id: new ObjectId(_id) });
        if( ! entity) {
            throw new Error(`Entity with id ${_id} not found in ${this.collectionName} collection`)
        }

        return entity
    }

    getEntity() {
        return this.entity
    }
}

module.exports = Repo;