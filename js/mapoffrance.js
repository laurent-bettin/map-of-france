/***********************************
'FR721': { //Code Eurostat NUTS except Mayotte which have note, code INSEE for region instead
    'identifier': Name,
    'type': region or department
    'INSEE': code INSEE
    'coo': SVG path
}

https://fr.wikipedia.org/wiki/Codes_g%C3%A9ographiques_de_la_France

**************************************/
var mapoffrance = (function(franceData) {
    "use strict";

    //private static method
    var isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    var outreMer = ['FR91', 'FR910', 'FR92', 'FR920', 'FR93', 'FR930', 'FR94', 'FR940', '06', '976'];

    var regions = ["FR42", "FR61", "FR72", "FR26", "FR52", "FR24", "FR21", "FR83", "FR43", "FR91", "FR93", "FR10",
    "FR81", "FR63", "FR41", "FR92", "06", "FR62", "FR3", "FR25", "FR23", "FR51", "FR22", "FR53", "FR82", "FR94", "FR71"]

    var dpts = ["976", "FR711", "FR221", "FR721", "FR821", "FR822", "FR823", "FR712", "FR211", "FR621", "FR212",
    "FR811", "FR622", "FR824", "FR251", "FR722", "FR531", "FR532", "FR241", "FR631", "FR831", "FR832", "FR261",
    "FR521", "FR632", "FR611", "FR431", "FR713", "FR231", "FR242", "FR522", "FR812", "FR623", "FR624", "FR612",
    "FR813", "FR523", "FR243", "FR244", "FR714", "FR432", "FR613", "FR245", "FR715", "FR723", "FR511", "FR246",
    "FR625", "FR614", "FR814", "FR512", "FR252", "FR213", "FR214", "FR513", "FR411", "FR412", "FR524", "FR413",
    "FR262", "FR301", "FR222", "FR253", "FR302", "FR724", "FR615", "FR626", "FR815", "FR421", "FR422", "FR716",
    "FR433", "FR263", "FR514", "FR717", "FR718", "FR-75", "FR232", "FR102", "FR103", "FR533", "FR223", "FR627",
    "FR628", "FR825", "FR826", "FR515", "FR534", "FR633", "FR414", "FR264", "FR434", "FR104", "FR105", "FR106",
    "FR107", "FR108", "FR910", "FR920", "FR930", "FR940"]

    var MapOfFrance = function(canvasId, width, height) {
        this.paper = new Raphael(canvasId, width, height);
        this.fset = null;
        this.customSetResult = [];

        this.opts = {
            customSetList: [],
            customExcludeList: [],
            excludeDpts: false,
            excludeRegions: false,
            excludeOutreMer: false,
            transformationMatrix: '', //m1 0 0 1 0 0
            attr: {
                'region': {
                    stroke: '#666'
                },
                'department': {
                    fill: '#d9dadb',
                    stroke: '#888'
                }
            }
        };

    };

    //return raphael instance
    MapOfFrance.prototype.getPaper = function() {
        return this.paper;
    };

    //return complete set of elements in the map
    //fset is null while map is not rendering
    MapOfFrance.prototype.getSet = function() {
        return this.fset;
    };

    MapOfFrance.prototype.setTransformationMatrix = function (transformationMatrix) {
        this.opts.transformationMatrix = transformationMatrix;
        return this;
    };

    //change default attribut for departments
    //chainable
    MapOfFrance.prototype.setDeptBaseAttr = function(attr) {
        this.opts.attr['department'] = attr;
        return this;
    };

    //return default attributes of departements
    MapOfFrance.prototype.getDeptBaseAttr = function() {
        return this.opts.attr['department'];
    };

    //change default attribut for regions
    //chainable
    MapOfFrance.prototype.setRegionsBaseAttr = function(attr) {
        this.opts.attr['region'] = attr;
        return this;
    };

    //return default attributes of regions
    MapOfFrance.prototype.getRegionsBaseAttr = function() {
        return this.opts.attr['region'];
    };

    //exclude all regions from rendering
    //chainable
    MapOfFrance.prototype.excludeRegions = function() {
        this.opts.excludeRegions = true;
        return this;
    };

    //exclude all departments from rendering
    //chainable
    MapOfFrance.prototype.excludeDepartments = function() {
        this.opts.excludeDpts = true;
        return this;
    };

    //exclude all departments from rendering
    //chainable
    MapOfFrance.prototype.excludeOutreMer = function() {
        this.opts.excludeOutreMer = true;
        return this;
    };

    //Set a custom list of departments to exclude from rendering
    //chainable
    MapOfFrance.prototype.setCustomExcludeList = function(excludeList) {
        this.opts.customExcludeList = excludeList;
        return this;
    };

    MapOfFrance.prototype.setCustomSetList = function(setList) {
        this.opts.customSetList.push(setList);
        return this;
    };

    MapOfFrance.prototype.createPath = function(coo, attr, datas) {
        var path = this.paper.path(coo);
        path.attr(attr);
        for (var k in datas) {
            path.data(k, datas[k]);
        }
        return path;
    };

    MapOfFrance.prototype.createCustomSet = function(element, index, array) {
        this.customSetResult.push(this.paper.set());
    };

    MapOfFrance.prototype.draw = function() {

        var deptOpts = this.opts.deptOpts;
        var regionOpts = this.opts.regionsOpts;
        var node;
        var datas;
        var zone;

        this.opts.customSetList.forEach(this.createCustomSet, this);

        var addToCustomSet = function(element, index, array) {
            var zoneIndex = element.indexOf(zone);
            if (zoneIndex !== -1) {
                this.customSetResult[index].push(node);
            }
        }

        this.paper.setStart();

        for (zone in franceData) {

            if( (this.opts.excludeRegions && franceData[zone].subdivisions === 'region') ||
                (this.opts.excludeDpts && franceData[zone].subdivisions === 'department') ||
                (this.opts.excludeOutreMer && outreMer.indexOf(zone) !== -1) ||
                (this.opts.customExcludeList.length && this.opts.customExcludeList.indexOf(zone) !== -1) ) {
                continue;
            }

            datas = {
                dataName: franceData[zone].identifier,
                dataInsee: franceData[zone].INSEE,
                dataType: franceData[zone].subdivisions
            };
            node = this.createPath(franceData[zone].coo, this.opts.attr[franceData[zone].subdivisions], datas);

            this.opts.customSetList.forEach(addToCustomSet, this);

        }

        this.fset = this.paper.setFinish();
        if(this.opts.transformationMatrix !== '') {
            this.fset.transform(this.opts.transformationMatrix);
        }

    };

    return {
        MapOfFrance: MapOfFrance
    };

})(franceData);
