import { Router, Request, Response, NextFunction } from 'express';
const Orgs = require("./../../data/data");

export class OrgRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        res.send(Orgs);
    }

    init() {
        this.router.get('/', this.getAll);
    }
}

const orgRoutes = new OrgRouter();
orgRoutes.init();

export default orgRoutes.router;