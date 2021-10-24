const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const router = express.Router();

const client = new MongoClient(process.env.MONGODB_URL);
const dbName = process.env.MONGODB_DB;

router.get('/:id', async (req, res) => {
    try {
        const _id = req.params.id;

        await client.connect();

        const collection = client.db(dbName).collection('employees');
        const employees = await collection.find({ '_id': ObjectId(_id) }).toArray();
        const employee = employees && employees.length ? employees[0] : null;

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({
                message: 'Record not found'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get('/', async (req, res) => {
    try {
        await client.connect();

        const collection = client.db(dbName).collection('employees');
        const employees = await collection.find({}).toArray();

        res.json(employees);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.post('/', async (req, res) => {
    try {
        await client.connect();

        const collection = client.db(dbName).collection('employees');
        const result = await collection.insertOne(req.body);

        if (result.acknowledged) {
            const employee = {
                '_id': result.insertedId,
                ...req.body
            };
            res.json(employee);
        } else {
            res.status(500).json({
                message: 'Record not inserted, received false acknowledgement'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.put('/:id', async (req, res) => {
    try {

        const _id = req.params.id;
        const employee = { ...req.body };

        delete employee['_id'];     // must be removed

        await client.connect();

        const collection = client.db(dbName).collection('employees');
        const result = await collection.updateOne({ '_id': ObjectId(_id) }, { $set: employee }, { upsert: true });

        if (result.modifiedCount || result.upsertedCount) {
            res.json(req.body);
        } else {
            res.status(404).json({
                message: 'Record not updated'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const _id = req.params.id;

        await client.connect();

        const collection = client.db(dbName).collection('employees');
        const result = await collection.deleteOne({ '_id': ObjectId(_id) });

        if (result.acknowledged && result.deletedCount) {
            res.json();
        } else {
            res.status(404).json({
                message: result.acknowledged ? 'Record not found' : 'Record not deleted, received false acknowledgement'
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;