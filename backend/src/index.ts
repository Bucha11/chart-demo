import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/uploadRouter';
import historyRouter from './routes/historyRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/upload', uploadRouter);
app.use('/api/history', historyRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
