{: eyebrows - logicless basic templating system for JSON
===

*eyebrows* is a JSON oriented logicless template library used for replacement of placeholders within a json structure with actual data.
The basic functionality is to provide a base template with some placeholders and a flat data object.
*eyebrows* will replace any occurrence of the placeholders within the JSON template with actual data.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save @francomalatacca/eyebrows
```

## Usage
The *eyebrows* template is a _valid_ JSON file. The placeholders are keys elements of JSON file which will be removed after the process will render the data.

template:
```javascript
{
    "key": "{{value}}"
}
```

data object:
```javascript
{
    "value": "hello world!"
}
```

to process the template and get the result 

```javascript
const eb = require('eyebrows');
const result = eb.render(template, dataObject);
```

## Template
A eyebrows template is a string that contains any number of tags. Tags are indicated by the double curly brackets like {{value}}. 
There are several kind of tags used for complex functionality like conditional and iterative stamentes.

## Conditional
Conditional tags can be used to show / hide part of the JSON object.

template:
```javascript
{
    "{{?value}}": {
        "key": "this key_value will show if value is true replacing the ?value key element"
    }
}
```

data object:
```javascript
{
    "value": true
}
```

output:
```javascript
{
    "key": "this key_value will show if value is true replacing the ?value key element"
}
```

## Iterative
Itarative tags can be used to render list of objects within a JSON object.

template:
```javascript
{
    "student": {
        "name": "jack doe",
        "{{..parents}}": {
            "name": "{{name}}",
            "other": false,
            "age": "{{age}}",
        }
    }
}
```

data object:
```javascript
{
    "parents": [
        {
            "name": "jonh doe",
            "age": 32
        },
        {
            "name": "jane edo",
            "age": 29
        }
    ]
}
```

output:
```javascript
{
    "student": {
        "name": "jack doe",
        "parents": [
            {
                "name": "jonh doe",
                "other": false,
                "age": 32
            },
            {
                "name": "jane edo",
                "other": false,
                "age": 29
            }
        ]
}
```
and with objects

template:
```javascript
{
    "a": {
        "b": {
            "{{__elements}}": {
                "first": {
                    "name": "{{name}}",
                    "age": "{{age}}"
                },
                "second": {
                    "name": "{{name}}",
                    "age": "{{age}}"
                }
            }
        }
    }
}
```

data object:
```javascript
{ 
    elements: {
        "first":    { 
            "name": "abc", 
            "lastName": "cde", 
            "age": 18 
        },
        "second":   { 
            "name": "xyz", 
            "lastName": "str", 
            "age": 29 
        }
    }
}
```

output:
```javascript
{
   "a":{
      "b":{
         "elements":{
            "first":{
               "name":"abc",
               "age":18
            },
            "second":{
               "name":"xyz",
               "age":29
            }
         }
      }
   }
}
```

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).


### Running Tests
Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm run test
```

### License

Copyright © 2020, [franco malatacca](https://github.com/francomalatacca).
Released under the [MIT License](LICENSE).
