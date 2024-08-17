const { Worker } = require('worker_threads');
const path = require('path');

exports.uploadFileService = (filePath) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, '../workers/upload.worker.js'), {
            workerData: { filePath }
        });

        worker.on('message', (message) => {
            if (message.status === 'success') {
                resolve('File uploaded and processed successfully');
            } else {
                reject(new Error(message.error));
            }
        });

        worker.on('error', (error) => {
            reject(error);
        });
    });
};
