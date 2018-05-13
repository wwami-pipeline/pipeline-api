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
        res.json(Orgs);
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

    public search(req: Request, res: Response, next: NextFunction) {
        var searchJSON = req.body;
        var myLat = 47.65718;
        var myLong = -122.31835;
        /*
        if (searchJSON['location'].length > 0) {
            location = searchJSON['location'];

        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(400).
                send('location required');
            res.end();
            return;
        }*/
        //var closestOrgs = Orgs.filter(org => this.distance(myLat, myLong, org.Lat, org.Long) < 10.0);
        //res.json(closestOrgs);
        var results = [];
        for (var i = 0; i < Orgs.length; i++) {
            var R = 3959;
            var distanceLat = (Orgs[i].Lat - myLat) * (Math.PI / 180);
            var distanceLong = (Orgs[i].Long - myLong) * (Math.PI / 180);

            var myLatRad = myLat * (Math.PI / 180);
            var destLat = Orgs[i].Lat * (Math.PI / 180);

            var a = Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) + Math.sin(distanceLong / 2) *
                Math.sin(distanceLong / 2) * Math.cos(myLatRad) * Math.cos(destLat);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var dist = R * c;
            if (dist < 10.0) {
                results.push(Orgs[i]);
            }
        }
        res.json(results);
        res.end();

    }

    public distance(initialLat: number, initialLong: number, destLat: number, destLong: number) {
        var R = 3959;
        var distanceLat = this.toRadians(destLat - initialLat);
        var distanceLong = this.toRadians(destLong - initialLong);

        initialLat = this.toRadians(initialLat);
        destLat = this.toRadians(destLat);

        var a = Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) + Math.sin(distanceLong / 2) *
            Math.sin(distanceLong / 2) * Math.cos(initialLat) * Math.cos(destLat);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public toRadians(degree: number) {
        return degree * (Math.PI / 180);
    }

    init() {
        this.router.get(
            '/',
            //passport.authenticate('local'),
            this.getAll);

        this.router.post(
            '/',
            this.search);

        this.router.get(
            '/:orgID',
            this.getById);
    }
}

const orgRoutes = new OrgRouter();
orgRoutes.init();

export default orgRoutes.router;