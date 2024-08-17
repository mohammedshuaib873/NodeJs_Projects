const uploadService = require('../services/upload.service');

exports.uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path;
        const message = await uploadService.uploadFileService(filePath);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};
