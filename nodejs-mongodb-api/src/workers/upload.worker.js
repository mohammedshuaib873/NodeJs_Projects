const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

// Import models
const Agent = require('../models/agent.model');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const LOB = require('../models/lob.model');
const Carrier = require('../models/carrier.model');
const Policy = require('../models/policy.model');

// Logging to ensure models are imported correctly
console.log('Agent Model:', Agent);
console.log('User Model:', User);
console.log('Account Model:', Account);
console.log('LOB Model:', LOB);
console.log('Carrier Model:', Carrier);
console.log('Policy Model:', Policy);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Worker connected to MongoDB');
}).catch(err => {
    console.error('Worker error connecting to MongoDB', err);
});

const processCSV = async (filePath) => {
    const data = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', async () => {
            try {
                for (const row of data) {
                    const agent = await Agent.create({ name: row['agent'] });
                    const user = await User.create({
                        firstname: row['firstname'],
                        dob: row['dob'],
                        address: row['address'],
                        phone: row['phone'],
                        state: row['state'],
                        zip: row['zip'],
                        email: row['email'],
                        gender: row['gender'],
                        userType: row['userType']
                    });
                    const account = await Account.create({ account_name: row['account_name'] });
                    const lob = await LOB.create({ category_name: row['category_name'] });
                    const carrier = await Carrier.create({ company_name: row['company_name'] });
                    const policy = await Policy.create({
                        policy_number: row['policy_number'],
                        policy_start_date: row['policy_start_date'],
                        policy_end_date: row['policy_end_date'],
                        policy_category: lob._id,
                        company: carrier._id,
                        user: user._id,
                    });
                }
                parentPort.postMessage({ status: 'success' });
            } catch (error) {
                parentPort.postMessage({ status: 'error', error: error.message });
            }
        });
};


processCSV(workerData.filePath);
