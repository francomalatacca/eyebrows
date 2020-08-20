const jpath = require("jsonpath")


function _render(template, data, symbol) {
    let parsedTemplate = JSON.parse(template);
    const keysDataObject = Object.keys(data);
    
    for(key in keysDataObject)
    {
        if(checkConditionalStatement(parsedTemplate, data, key)){
            if(!data[Object.keys(data)[key]]){
                delete parsedTemplate['{{?' + Object.keys(data)[key] + '}}' ];
            }else{
            var paths = jpath.paths(parsedTemplate, "$..[\"{{?" + Object.keys(data)[key] + "}}\"]");
                paths.forEach(path => {
                    path = path.slice(0,path.length -1);
                    setValue(parsedTemplate,path,jpath.value(parsedTemplate, "$..[\"{{?" + Object.keys(data)[key] + "}}\"]"), Object.keys(data)[key]);
                }); 
            }
            template = JSON.stringify(parsedTemplate);
        }
        if(checkIterativeStatement(parsedTemplate, data, key)){
            const paths = jpath.paths(parsedTemplate, "$..[\"{{.." + Object.keys(data)[key] + "}}\"]");
            if(checkDataArrayIsEmpty(data)){
                removeIterativeStatementFromTemplate(parsedTemplate, paths, "$..[\"{{.." + Object.keys(data)[key] + "}}\"]");
            }else{
                expandIterationAndReplaceValue(paths, data, parsedTemplate); 
                removeIterativeStatementFromTemplate(parsedTemplate, paths, "{{.." + Object.keys(data)[key] + "}}");

            }
            template = JSON.stringify(parsedTemplate);
        }
        ({ template, parsedTemplate } = replaceValue(data, template, parsedTemplate));
    }
    return JSON.parse(template);
}

function expandIterationAndReplaceValue(paths, data, parsedTemplate) {
    paths.forEach(path => {
        path = path.slice(0, path.length - 1);
        path.push(Object.keys(data)[key]);
        const dataArray = data[Object.keys(data)[key]];
        let count = 0;
        for (const el in dataArray) {
            const dataArrayObjectKeys = Object.keys(data[Object.keys(data)[key]][el]);
            setValueArray(parsedTemplate, path, jpath.value(parsedTemplate, "$..[\"{{.." + Object.keys(data)[key] + "}}\"]"), Object.keys(data)[key], dataArray[el]);
        }
    });
}

function removeIterativeStatementFromTemplate(parsedTemplate, paths, key) {
        paths.forEach(path => {
            let obj = parsedTemplate;
            for (let i = 1; i < path.length - 1; i++) {
                if(obj[path[i]]){  
                    obj = obj[path[i]];
                }
            }
            delete obj[key];
        });
}

function checkDataArrayIsEmpty(data) {
    return data[Object.keys(data)[key]].length == 0;
}

function replaceValue(data, template, parsedTemplate) {
    if (typeof (data[Object.keys(data)[key]]) === "number") {
        template = (template).replace(new RegExp("\"\{\{" + Object.keys(data)[key] + "+\}\}\"+", "g"), data[Object.keys(data)[key]]);
        parsedTemplate = JSON.parse(template);
    }
    else {
        template = (template).replace(new RegExp("\{\{" + Object.keys(data)[key] + "+\}\}+", "g"), data[Object.keys(data)[key]]);
        parsedTemplate = JSON.parse(template);
    }
    return { template, parsedTemplate };
}

function checkIterativeStatement(parsedTemplate, data) {
    return jpath.paths(parsedTemplate, "$..[\"{{.." + Object.keys(data)[key] + "}}\"]").length > 0;
}

function checkConditionalStatement(parsedTemplate, data, key) {
    return jpath.paths(parsedTemplate, "$..[\"{{?" + Object.keys(data)[key] + "}}\"]").length > 0;
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

function setValue(obj, path, obj2, todel) {
    var i;
    for (i = 1; i < path.length; i++) {
        obj = obj[path[i]];
    }
    Object.keys(obj2).forEach(element => {
        obj[element] = obj2[element];
    });
    delete obj['{{?' + todel + '}}'];
}

function setValueArray(obj, path, obj2, todel, newValue, isDel = false) {
    var i;
    for (i = 1; i < path.length; i++) {
        if(obj[path[i]]){  
                  obj = obj[path[i]];
        }else {
            obj[path[i]] = [];
            obj = obj[path[i]];
        }
    }
    
    for (const k in Object.keys(obj2)) {
        const currentKey = Object.keys(obj2)[k];
        const currentValue = newValue[currentKey.replace('{{','').replace('}}','')];
        if(typeof (currentValue) === "number"){
            obj2 = JSON.parse((JSON.stringify(obj2)).replace(new RegExp(Object.keys(obj2)[k].indexOf("{") > -1 ? Object.keys(obj2)[k] : "\"\{\{" + Object.keys(obj2)[k] + "+\}\}\"+","g"), currentValue));
        }else{
            obj2 = JSON.parse((JSON.stringify(obj2)).replace(new RegExp(Object.keys(obj2)[k].indexOf("{") > -1 ? Object.keys(obj2)[k] : "\{\{" + Object.keys(obj2)[k] + "+\}\}+","g"), currentValue));
        }
    }
    obj.push(obj2);
}

exports.render = function(template, data) {
    if(JSON.stringify(template).indexOf('{{') == -1 ) {
        return template;
    }else{
        return JSON.parse(JSON.stringify(_render(JSON.stringify(template), data)));
    }
}
