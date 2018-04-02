import * as passport from 'passport';
import { Strategy } from 'passport-local';

const testUser = {
    username: 'test-jshill',
    passwordHash: 'asdf',
    password: 'poop',
    id: 1
}
// const testUser = null;

export class AuthInit {

    // constructor() {
    //     this.init();
    // }

    init() {
        console.log('init auth');
        passport.use(new Strategy(
            (username, password, done) => {
                console.log('authenticating');
                //if(testUser === null) { return done(null, false)}

                return done(null, testUser);
            }
        ));
        return passport.initialize();
    }
}

export default new AuthInit();