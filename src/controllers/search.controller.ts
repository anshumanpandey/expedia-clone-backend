import axios from 'axios'
import { Request } from 'express'
import { sequelize } from '../utils';
const qs = require('qs')

export class SearchController {
    public index(req: Request) {

        var date = new Date();
        var current_hour = date.getHours();

        return axios({
            url: `${process.env.SEARCH_API_URL}/search`,
            params: {
                location: req.query.locationId,
                puDate: req.query.puDate,
                puTime: req.query.puTime || `${current_hour + 1}:00`,
                doDate: req.query.doDate,
                doTime: req.query.doTime || `${current_hour + 1}:00`,
                currency: req.query.currency,
                country: req.query.country,
                json: true,
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        })
            .then(r => r.data)
            .then(xml => {
                return xml;
            })
    }

    public async iataCodes(req: Request) {

        const [ results ] = await sequelize.query(`SELECT * from iata WHERE location LIKE '%${req.query.search}%' or code LIKE '%${req.query.search}%'`);
        return results;
    }

    public async filters(req: Request) {

        return axios({
            url: `${process.env.SEARCH_API_URL}/categories/${req.params.offering}`,
        })
            .then(r => r.data)
            .then(r => r.filter(v => v.disabled !== true))
            .then(res => res)
    }
}