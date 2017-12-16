'use strict';

const server = require('server');
const request = require('supertest')(server);
const joi = require('joi');
const faker = require('faker');

describe('Rule', () => {

    describe('POST /v1/rules', () => {

        describe('Create Rule', () => {

            it('should successfully create a new rule', (done) => {
                
                let data =  {
                    name: faker.lorem.sentence(),
                    conditions: `{"conditions": {"any": [{"all": [{"fact": "gameDuration","operator": "equal","value": 40 ` +
                        `}, {"fact": "personalFoulCount","operator": "greaterThanInclusive","value": 5}]}, { ` +
                        `"all": [{"fact": "gameDuration","operator": "equal","value": 48}, {"fact": "personalFoulCount",` +
                        `"operator": "greaterThanInclusive","value": 6}]}]}}`,
                    action: faker.lorem.sentence(),
                    updated_by: faker.internet.email(),
                    status: 'active',
                };

                request.post(`/v1/rules`)
                    .send(data)
                    .expect('Content-type', 'application/json')
                    .expect(201)
                    .expect(res => {
                        const schema = {
                            status: joi.string().valid('success').required(),
                            data: joi.object().keys({
                                id: joi.number().positive().required(),
                                name: joi.string().valid(data.name).required(),
                                conditions: joi.string().required(),
                                action: joi.string().required(),
                                updated_by: joi.string().required(),
                                status: joi.string().required(),
                                created_at: joi.date().required(),
                                updated_at: joi.date().required()
                            })
                        };
                        joi.assert(res.body, schema);
                    })
            .end(done);
            });
        });
    });
});