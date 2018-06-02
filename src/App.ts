import * as path from 'path';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';

import { Strategy } from 'passport-local';

//improt auth
import AuthInit from './auth/AuthInit';

// import routers
import OrgRouter from './routes/OrgRouter';

const testUser = {
    username: 'test-jshill',
    passwordHash: 'asdf',
    password: 'password',
    id: 1
}

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    /*
    this.express.use(passport.initialize());
    passport.use(new Strategy(
        (username, password, done) => {
            console.log('authenticating');
            //if(testUser === null) { return done(null, false)}

            return done(null, testUser);
        }
    ));
    passport.serializeUser(function(user, done) {
      done(null, testUser.id);
    });
    
    passport.deserializeUser(function(id, done) {
      //User.findById(id, function (err, user) {
        done(null, testUser);
      //});
    });
    */
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.express.use('/', router);
    this.express.use('/api/v1/orgs', OrgRouter);
  }

}

export default new App().express;