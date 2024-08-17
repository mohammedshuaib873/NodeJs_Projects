const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const os = require('os-utils');
const pm2 = require('pm2');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/scheduler', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define Message Schema
const messageSchema = new mongoose.Schema({
    message: String,
    date: Date,
});

const Message = mongoose.model('Message', messageSchema);

// Monitor CPU Utilization and Restart Server if Usage > 70%
function monitorCPU() {
    setInterval(() => {
        os.cpuUsage((v) => {
            console.log('CPU Usage (%): ' + v * 100);

            if (v > 0.7) { // If CPU usage is more than 70%
                console.log('CPU usage exceeded 70%. Restarting server...');
                pm2.connect((err) => {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    pm2.restart('app', (err) => {
                        if (err) {
                            console.error('Error restarting server:', err);
                        } else {
                            console.log('Server restarted successfully');
                        }
                        pm2.disconnect();
                    });
                });
            }
        });
    }, 5000); // Check CPU every 5 seconds
}

// Schedule a message insertion
app.post('/schedule-message', (req, res) => {
    const { message, day, time } = req.body;

    const [hour, minute] = time.split(':');
    const date = new Date(`${day}T${hour}:${minute}:00Z`);

    cron.schedule(`${minute} ${hour} ${day.split('-')[2]} ${day.split('-')[1]} *`, async () => {
        try {
            const newMessage = new Message({ message, date });
            await newMessage.save();
            console.log('Message inserted into the database:', message);
        } catch (error) {
            console.error('Error inserting message:', error);
        }
    });

    res.status(200).json({ message: 'Message scheduled successfully' });
});

// Start CPU Monitoring
monitorCPU();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    pm2.start({
        script: 'server.js',
        name: 'app'
    }, function (err, apps) {
        pm2.disconnect();
        if (err) throw err;
    });
});
