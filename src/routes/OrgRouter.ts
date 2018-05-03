import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { isNumber } from 'util';

var Orgs = require("./../../data/orgs.json");

export class OrgRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        res.setHeader('Content-type', 'application/json');
        res.send(Orgs);
        res.end();
    }

    public getById(req: Request, res: Response, next: NextFunction) {       
        var param = req.params.orgID;

        var org = Orgs.filter(org => org.OrgID == param)

        if (org.length != 1) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).
                send('org not found');
            res.end();
            return;
        }

        res.json(org[0]);
        res.end();
    }

    public getByName(req: Request, res: Response, next: NextFunction) {
        var param = req.params.orgName;

        var org = Orgs.filter(org => org.OrgName == param)

        if (org.length != 1) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).
                send('org not found');
            res.end();
            return;
        }

        res.json(org[0]);
        res.end();
    }

    public updateByName(req: Request, res: Response, next: NextFunction) {
        var param = req.params.orgName;

        var org = Orgs.filter(org => org.OrgTitle == param)

        if (org.length != 1) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).
                send('org not found');
            res.end();
            return;
        }
    }

    init() {
        this.router.get(
            '/',
            //passport.authenticate('local'),
            this.getAll);

        this.router.get(
            '/:orgID',
            this.getById);
        
        this.router.patch(
            '/:orgName',
            this.updateByName);
    }
}

const orgRoutes = new OrgRouter();
orgRoutes.init();

export default orgRoutes.router;