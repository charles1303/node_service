'use strict';

let RuleEngine = require('json-rules-engine');

describe('Rules Engine test', function() {

    it('Rules Engine test 1', function(done) {
        let engine = new RuleEngine.Engine();
        let myRule = `{"any": [{"all": [{"fact": "gameDuration","operator": "equal","value": 40 }, {"fact": "personalFoulCount","operator": "greaterThanInclusive","value": 5}]}, { "all": [{"fact": "gameDuration","operator": "equal","value": 48}, {"fact": "personalFoulCount","operator": "greaterThanInclusive","value": 6}]}]}`;
        //var conditions = JSON.stringify(eval("(" + myRule + ")"));
        var conditions = JSON.parse(myRule);
        
        let event = {  // define the event to fire when the conditions evaluate truthy
                type: 'fouledOut',
                params: {
                    message: 'Player has fouled out!'
                }
            }
        
        engine.addRule(new RuleEngine.Rule({conditions, event}));
        
        /*engine.addRule({
            conditions: {
                any: [{
                    all: [{
                        fact: 'gameDuration',
                        operator: 'equal',
                        value: 40
                    }, {
                        fact: 'personalFoulCount',
                        operator: 'greaterThanInclusive',
                        value: 5
                    }]
                }, {
                    all: [{
                        fact: 'gameDuration',
                        operator: 'equal',
                        value: 48
                    }, {
                        fact: 'personalFoulCount',
                        operator: 'greaterThanInclusive',
                        value: 6
                    }]
                }]
            },
            event: {  // define the event to fire when the conditions evaluate truthy
                type: 'fouledOut',
                params: {
                    message: 'Player has fouled out!'
                }
            }
        });

        /**
         * Define facts the engine will use to evaluate the conditions above.
         * Facts may also be loaded asynchronously at runtime; see the advanced example below
         */
        let facts = {
            personalFoulCount: 6,
            gameDuration: 48
        };

        // Run the engine to evaluate
        engine
          .run(facts)
          .then(events => { // run() returns events with truthy conditions
              events.map(event => console.log(event.params.message));
          });

        /*
         * Output:
         *
         * Player has fouled out!
         */
        done();
    });

    it('Rules Engine test 2', function(done) {
        let engine = new RuleEngine.Engine();
        let event = {
            type: 'young-adult-rocky-mnts',
            params: {
                giftCard: 'amazon',
                value: 50
            }
        };

        let conditions = {
            all: [
                {
                    fact: 'age',
                    operator: 'greaterThanInclusive',
                    value: 18
                }, {
                    fact: 'age',
                    operator: 'lessThanInclusive',
                    value: 25
                },
                {
                    any: [
                        {
                            fact: 'state',
                            params: {
                                country: 'us'
                            },
                            operator: 'equal',
                            value: 'CO'
                        }, {
                            fact: 'state',
                            params: {
                                country: 'us'
                            },
                            operator: 'equal',
                            value: 'UT'
                        }
                    ]
                }
            ]
        };
        let rule = new RuleEngine.Rule({ conditions, event });
        engine.addRule(rule);
        // save somewhere... 
        let jsonString = rule.toJSON();
        console.log(jsonString);
         
        // ...later: 
        rule = new RuleEngine.Rule(jsonString)

        /**
         * Define facts the engine will use to evaluate the conditions above.
         * Facts may also be loaded asynchronously at runtime; see the advanced example below
         */
        let facts = {
            age: 19,
            state: 'CO'
        };

        // Run the engine to evaluate
        engine
          .run(facts)
          .then(events => { // run() returns events with truthy conditions
              events.map(event => console.log(event.params.giftCard + ' ' + event.params.value));
          });
        done();
    });
});
