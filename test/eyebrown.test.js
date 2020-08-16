const expect = require('chai').expect;
// import math file
const eye = require('../index');
describe('eyebrown.js value replacement', () => {

    describe('render Test', () => {
         
        it('should return the template without any changes', () => {
            const result = eye.render({ "key": "test" }, {});
            expect(result["key"]).to.be.equal('test');
        });

        it('should replace value', () => {
            const result = eye.render({ "key": "{{value}}" }, { value: "test" });
            expect(result["key"]).to.be.equal("test");
        });


        it('should replace value in complex json', () => {
            const complex = {
                "a": {
                    "b": ["{{value}}"],
                    "c": {
                        "d": {
                            "e": "{{value}}"
                        }
                    }
                }
            }
            const result = eye.render(complex, { value: "test" });
            expect(result.a.c.d.e).to.be.equal("test");
        });
        
        it('should replace value in complex json - array version', () => {
            const complex = {
                "a": {
                    "b": ["{{value}}"],
                    "c": {
                        "d": {
                            "e": "{{value}}"
                        }
                    }
                }
            }
            const result = eye.render(complex, { value: "test" });
            expect(result.a.b[0]).to.be.equal("test");
            expect(result.a.c.d.e).to.be.equal("test");
        });

        it('should replace a numeric value as numeric element', () => {
            const result = eye.render({ "key": "{{value}}" }, { value: 1 });
            expect(result["key"]).to.be.equal(1);
        });
        
        it('should replace a numeric value as string element', () => {
            const result = eye.render({ "key": "{{value}}" }, { value: "1" });
            expect(result["key"]).to.be.equal("1");
        });

    });

    describe('eyebrown.js conditional block rendering', () => {
        
        it('should not render a template section if a value is false', () => {
            const result = eye.render({ "key": "value", "{{?value}}": { "key_hidden": "value" } }, { value: false });
            expect(result["key_hidden"]).to.be.undefined;
        });
        it('should render a template section if a value is true', () => {
            const result = eye.render({ "key": "value", "{{?value}}": { "key_hidden": "value" } }, { value: true });
            expect(result["key_hidden"]).to.equal("value");
        });
        it('should render a template section if a value is true within a complex template', () => {

        const complex = {
            "a": {
                "b": ["{{value}}"],
                "c": {
                    "d": {
                        "e": "{{value}}",
                        "{{?value2}}": {
                            "{{value}}": "this shuld be replaced as key"
                        }
                    },
                    "{{?value}}": {
                        "this": "is hidden",
                        "{{value}}": "this shuld be replaced as key",
                        "this": "should be replaced as {{value}}"
                    }
                }
            }
        }
            const result = eye.render(complex, { value: true, value2: true });
            expect(result["a"]["c"]["this"]).to.equal("should be replaced as true");
            expect(result["a"]["c"]["d"]["true"]).to.be.not.null;
        });
    })
    describe('eyebrown.js iterative block rendering', () => {
        
    it('should render a list of object with an iterative process', () => {

        const complex = {
            "a": {
                "b": {
                    "{{..elements}}": {
                        "name": "{{name}}",
                        "age": "{{age}}"
                    }
                }
            }
        }
        const result = eye.render(complex, { elements: [{"name": "abc", "lastName": "cde", "age": 18},{"name": "xyz", "lastName": "str", "age": 29}] });
        console.log(result);
        expect(result["a"]["b"]["elements"][0]["name"]).to.equal("abc");
        expect(result["a"]["b"]["elements"][0]["age"]).to.equal(18);
        expect(result["a"]["b"]["elements"][1]["name"]).to.equal("xyz");
        expect(result["a"]["b"]["elements"][1]["age"]).to.equal(29);
        });
    
        it('should render the student elements with an iterative process', () => {

            const template = {
                "student": {
                    "name": "jack doe",
                    "{{..parents}}": {
                        "name": "{{name}}",
                        "other": false,
                        "age": "{{age}}",
                    }
                }
            }

            const data = {
                "parents": [
                    {
                        "name": "john doe",
                        "age": 32
                    },
                    {
                        "name": "jane edo",
                        "age": 29
                    }
                ]
            }
            const result = eye.render(template, data);
            console.log(result);
            expect(result["student"]["parents"][0]["name"]).to.equal("john doe");
            expect(result["student"]["parents"][1]["age"]).to.equal(29);
            expect(result["student"]["parents"][1]["other"]).to.equal(false);
            });
    });
});