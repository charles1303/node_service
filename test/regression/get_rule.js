'use strict';

const server = require('server');
const request = require('supertest')(server);
const joi = require('joi');
const faker = require('faker');
const RuleEngine = require('json-rules-engine');

describe('Rule', () => {

    describe('GET /v1/rules/:rule_id', () => {

        describe('Get a Rule', () => {

            it('should successfully get a rule', (done) => {
                
                let ruleId = 1;
                request.get(`/v1/rules/${ruleId}`)
                .send()
                .expect('Content-type', 'application/json')
                .expect(200)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('success').required(),
                        data: joi.object().keys({
                            id: joi.number().positive().valid(ruleId).required(),
                            name: joi.string().required(),
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
        
        describe('Process a Rule', () => {

            it('should successfully process a rule', (done) => {
                
                let ruleId = 1;
                request.get(`/v1/rules/${ruleId}`)
                .send()
                .expect('Content-type', 'application/json')
                .expect(200)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('success').required(),
                        data: joi.object().keys({
                            id: joi.number().positive().valid(ruleId).required(),
                            name: joi.string().required(),
                            conditions: joi.string().required(),
                            action: joi.string().required(),
                            updated_by: joi.string().required(),
                            status: joi.string().required(),
                            created_at: joi.date().required(),
                            updated_at: joi.date().required()
                        })
                    };
                    joi.assert(res.body, schema);
                    
                    let myRule = JSON.parse(res.body.data.conditions);
                    let engine = new RuleEngine.Engine();
                    let event = {
                        type: 'fouledOut',
                        params: {
                            message: 'Player has fouled out!'
                        }
                    };
                    let conditions = myRule['conditions'];
                    let rule = new RuleEngine.Rule({conditions, event});
                    
                    function render (message, ruleResult) {
                        // if rule succeeded, render success message
                        //console.log('In Here....');
                        //console.log(ruleResult);
                        //console.log(JSON.stringify(ruleResult));
                        if (ruleResult.result) {
                            //console.log('In Here 2....');
                            //console.log(`${message}`);
                          return `${message}`;
                        }
                        //console.log(ruleResult);
                        // if rule failed, iterate over each failed condition to determine why the student didn't qualify for athletics honor roll
                        let detail = ruleResult.conditions.any.filter(condition => !condition.result)
                        .map(condition => {
                            //console.log(JSON.stringify(condition));
                          switch (condition.operator) {
                            case 'equal':
                                //console.log(`was not an ${condition.fact}`);
                              return `was not an ${condition.fact}`
                            case 'greaterThanInclusive':
                                //console.log(`${condition.fact} of ${condition.factResult} was too high`);
                              return `${condition.fact}  was too high`
                            default:
                                return `${condition.fact} was too low`
                          }
                        }).join(' and ')
                        console.log(`${message} ${detail}`)
                      }
                    
                    rule.on('success', function(event, almanac, ruleResult) {
                        console.log('success') // { type: 'my-event', params: { id: 1 }
                        almanac.factValue('personalFoulCount').then(personalFoulCount => {
                            //console.log(`${personalFoulCount}`);
                            //console.log(`${event}`);
                            //console.log(`${event.params}`);
                            //console.log(`${event.params.message}`);
                            //console.log(ruleResult);
                            console.log(render(`${personalFoulCount} succeeded! ${event.params.message}`, ruleResult));
                        });
                      });
                    
                    rule.on('failure', function(event, almanac, ruleResult) {
                        console.log('failure') // { type: 'my-event', params: { id: 1 }
                        almanac.factValue('personalFoulCount').then(personalFoulCount => {
                            console.log(render(`${personalFoulCount} failed - `, ruleResult));
                        });
                      });
                    
                    engine.addRule(rule);
                    
                    /**
                    * Define facts the engine will use to evaluate the conditions above.
                    * Facts may also be loaded asynchronously at runtime; see the advanced example below
                    */
                   let facts = {
                        personalFoulCount: 4,
                        gameDuration: 48
                    };
                    
                   // Run the engine to evaluate
                   engine
                     .run(facts)
                     .then(events => { // run() returns events with truthy conditions
                        //console.log('ran the rule engine event...' + JSON.stringify(event));
                         //events.map(event => console.log(event.params.message));
                     });
                })
            .end(done);
            });
        });
    });
});
