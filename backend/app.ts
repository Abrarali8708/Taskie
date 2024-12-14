import express from 'express'
import bodyParser from 'body-parser';
import routes from './routes/index';
import db from './util/database';
db();

const app = express();

app.use(bodyParser.json());
const cors = require('cors');
const corsOptions ={
    origin:'https://taskie-frontend-eta.vercel.app', 
    credentials:true,          
}
app.use(cors(corsOptions));

app.use('/',routes);

// app.listen(8080);
export default app