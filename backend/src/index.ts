import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;