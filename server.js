import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import handleSignin from './controllers/signin.js';
import handleRegister from './controllers/register.js';
import handleProfile from './controllers/profile.js';
import handleImage from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        user:'postgres',
        port: 5432,
        password:'1234',
        database:'smart-brain'
    }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.get('/profile/:id', handleProfile(db));
app.put('/image', handleImage(db));
app.get('/', (req,res) => {
    res.json({id: 1, name:"Harry"});
})

app.listen(3001, () => {
    console.log('App is running on port 3001');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/resgister --> POST = user
/profile/:id --> GET = user
/image --> PUT --> user
*/