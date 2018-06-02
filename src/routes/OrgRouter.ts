import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { isNumber } from 'util';

//var Orgs = require("./../../data/orgs.json");
var request = require('request');

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
        request('http://pipelinemicroservice:4002/v1/pipeline-db/getallorgs', function(err, response, body) {
            if (err) {
                return next(err);
            }
            var Orgs = JSON.parse(body);
            res.json(Orgs);
            res.end();
        });
    }

    public populateOrgs(req: Request, res: Response, next: NextFunction) {
        request.post('http://pipelinemicroservice:4002/v1/pipeline-db/populate-organizations', req.body, function(err, response, body) {
            console.log(JSON.stringify(req.body));
            if (err) {
                return next(err);
            }
            res.status(response.statusCode).send("organization successfully added");
            res.end();
        });
    }

    public getById(req: Request, res: Response, next: NextFunction) {       
        var param = req.params.orgID;

        request('http://pipelinemicroservice:4002/v1/pipeline-db/getallorgs', function (err, response, body) {
            if (err) {
                return next(err);
            }

            var Orgs = JSON.parse(body);
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
        });
    }

    public getByName(req: Request, res: Response, next: NextFunction) {
        var param = req.params.orgName;

        request('http://pipelinemicroservice:4002/v1/pipeline-db/getallorgs', function (err, response, body) {
            if (err) {
                return next(err);
            }

            var Orgs = JSON.parse(body);
            var org = Orgs.filter(org => org.OrgTitle == param)

            if (org.length != 1) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(404).
                    send('org not found');
                res.end();
                return;
            }

            res.json(org[0]);
            res.end();
        });
    }

    public search(req: Request, res: Response, next: NextFunction) {
        let containsSubset = function(subset: number[], superset: number[]): boolean {
            if (0 === subset.length) {
                return false;
            }
            return subset.every(function (value) {
                return (superset.indexOf(value) >= 0);
            });
        };
        var searchJSON = req.body;
        var location = searchJSON.location;
        if (!location) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(400).send('location parameter must be provided');
            res.end();
            return;
        }

        request('http://pipelinemicroservice:4002/v1/pipeline-db/getallorgs', function (err, response, body) {
            if (err) {
                return next(err);
            }
            var Orgs = JSON.parse(body);
            mapsClient.geocode({ address: location })
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
                            var middleschool = [];
                            var highschool = [];
                            if (Array.from(searchJSON['GradeLevels']).indexOf("Middle School") != -1) {
                                middleschool.push.apply(middleschool, [6, 7, 8]);
                            }

                            if (Array.from(searchJSON['GradeLevels']).indexOf("High School") != -1) {
                                highschool.push.apply(highschool, [9, 10, 11, 12]);
                            }

                            results = results.filter(result => containsSubset(middleschool, result.GradeLevels) ||  containsSubset(highschool, result.GradeLevels) || result.GradeLevels.length == 0);
                        }

                        if (searchJSON['HasCost']) {
                            results = results.filter(result => result.HasCost == searchJSON['HasCost']);
                        }

                        if (searchJSON['HasTransport']) {
                            results = results.filter(result => result.HasTransport == searchJSON['HasTransport']);
                        }

                        if (searchJSON['CareerEmp']) {
                            if (Array.from(searchJSON['CareerEmp']).length > 0) {
                                results = results.filter(result => containsSubset(result.CareerEmp, searchJSON['CareerEmp']));
                            }
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
                    console.log(err);
                    res.setHeader('Content-Type', 'text/plain');
                    res.status(500).send(err);
                    res.end();
                    return;
                });
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
            '/id/:orgID',
            this.getById);
        
        this.router.get(
            '/name/:orgName',
            this.getByName);

        this.router.post(
            '/populateorg',
            this.populateOrgs);
    }
}

const orgRoutes = new OrgRouter();
orgRoutes.init();

export default orgRoutes.router;