const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload.routes');
const searchRoutes = require('./routes/search.routes');
const aggregateRoutes = require('./routes/aggregate.routes');
require('./config/database');

app.use(express.json());

app.use('/api', uploadRoutes);
app.use('/api', searchRoutes);
app.use('/api', aggregateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
