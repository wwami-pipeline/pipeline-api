import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { isNumber } from 'util';
import fetch from 'node-fetch';

var Orgs = require("./../../data/orgs.json");

var pipelinemicroservice = process.env.PIPELINEMICROSERVICE;
var mapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDp-LsNg9RusqlMLx2K9_VXXWudUk2-d6c',
    Promise: Promise
});

export class OrgRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        fetch('pipelinemicroservice:4002/v1/pipeline-db/getallorgs')
            .then(response => res.send(response))
            .catch(err => res.send(err));
            /*.then(data => {
                res.json(data);
                res.end();
            })*/
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
        var location = searchJSON.location;
        if (!location) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(400).send('location parameter must be provided');
            res.end();
            return;
        }
        mapsClient.geocode({address: location})
            .asPromise()
            .then((response) => {
                var searchLat = response.json.results[0].geometry.location.lat;
                var searchLong = response.json.results[0].geometry.location.lng;

                var results = [];
                for (var i = 0; i < Orgs.length; i++) {
                    var R = 3959;
                    var distanceLat = (Orgs[i].Lat - searchLat) * (Math.PI / 180);
                    var distanceLong = (Orgs[i].Long - searchLong) * (Math.PI / 180);

                    var myLatRad = searchLat * (Math.PI / 180);
                    var destLat = Orgs[i].Lat * (Math.PI / 180);

                    var a = Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) + Math.sin(distanceLong / 2) *
                        Math.sin(distanceLong / 2) * Math.cos(myLatRad) * Math.cos(destLat);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var dist = R * c;
                    if (dist < 10.0) {
                        results.push(Orgs[i]);
                    }

                    if (searchJSON['GradeLevels']) {
                        results = results.filter(result => result.GradeLevels.toString == searchJSON['GradeLevels'].toString());
                    }

                    if (searchJSON['HasCost']) {
                        results = results.filter(result => result.HasCost == searchJSON['HasCost']);
                    }

                    if (searchJSON['HasTransport']) {
                        results = results.filter(result => result.HasTransport == searchJSON['HasTransport']);
                    }

                    if (searchJSON['CareerEmp']) {
                        results = results.filter(result => result.CareerEmp.toString() == searchJSON['CareerEmp'].toString());
                    }

                    if (searchJSON['Under18']) {
                        results = results.filter(result => result.Under18 == searchJSON['Under18']);
                    }
                }
                res.json(results);
                res.end();
                return;
            })
            .catch((err) => {
                res.setHeader('Content-Type', 'text/plain');
                res.status(500).send(err);
                res.end();
                return;
            });
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