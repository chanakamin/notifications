import express from 'express';
import bodyParser from 'body-parser';
import messageRouter from './routes/message.routes.js';
import preferencesRouter from './routes/preferences.router.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(authMiddleware);

app.use('/message', messageRouter);
app.use('/preferences', preferencesRouter);

app.get('/', (req, res) => {
    res.send('service work')
  });

app.use(errorHandler)
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})