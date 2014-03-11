var mapoffrance = (function(franceData) {
    "use strict";

    //private static method
    var isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    var MapOfFrance = function(canvasId, width, height) {
        this.paper = new Raphael(canvasId, width, height);
        this.fset = null;
        this.opts = {
            transformationMatrix: 'm1 0 0 1 0 0',
            regionsOpts: {
                // possible attributs : http://raphaeljs.com/reference.html#Element.attr
                attr: {
                    base: {
                        stroke: '#666'
                    }
                },
                exclude: {
                    everything: false,
                    list: []
                }
            },
            deptOpts: {
                // possible attributs : http://raphaeljs.com/reference.html#Element.attr
                attr: {
                    base: {
                        fill: '#d9dadb',
                        stroke: '#888',
                        cursor: 'pointer'
                    }
                },
                exclude: {
                    everything: false,
                    list: []
                },
                onMouseOver: null,
                onMouseOut: null
            }
        };

    };

    //return raphael instance
    MapOfFrance.prototype.getPaper = function() {
        return this.paper;
    };

    MapOfFrance.prototype.setTransformationMatrix = function (transformationMatrix) {
        this.opts.transformationMatrix = transformationMatrix;
        return this;
    };

    //change default attribut for departments
    //chainable
    MapOfFrance.prototype.setDeptBaseAttr = function(attr) {
        this.opts.deptOpts.attr.base = attr;
        return this;
    };

    //return default attributes of departements
    MapOfFrance.prototype.getDeptBaseAttr = function() {
        return this.opts.deptOpts.attr.base;
    };

    //change default attribut for regions
    //chainable
    MapOfFrance.prototype.setRegionsBaseAttr = function(attr) {
        this.opts.regionsOpts.attr.base = attr;
        return this;
    };

    //return default attributes of regions
    MapOfFrance.prototype.getRegionsBaseAttr = function() {
        return this.opts.regionsOpts.attr.base;
    };

    //exclude all regions from rendering
    //chainable
    MapOfFrance.prototype.excludeRegions = function() {
        this.opts.regionsOpts.exclude.everything = true;
        return this;
    };

    //exclude all departments from rendering
    //chainable
    MapOfFrance.prototype.excludeDepts = function() {
        this.opts.deptOpts.exclude.everything = true;
        return this;
    };

    //Set a custom list of departments to exclude from rendering
    //chainable
    MapOfFrance.prototype.setDeptsExcludeList = function(excludeList) {
        this.opts.deptOpts.exclude.list = excludeList;
        return this;
    };

    //Set a custom list of regions to exclude from rendering
    //chainable
    MapOfFrance.prototype.setRegionsExcludeList = function(excludeList) {
        this.opts.regionsOpts.exclude.list = excludeList;
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

    MapOfFrance.prototype.draw = function() {

        var departments = franceData.departments; //shortcut
        var regions = franceData.regions; //shortcut
        var deptOpts = this.opts.deptOpts;
        var regionOpts = this.opts.regionsOpts;
        var node;
        var datas;

        this.paper.setStart();

        if (!deptOpts.exclude.everything) {
            for (var d in departments) {
                if (deptOpts.exclude.list.indexOf(d) === -1) {
                    // var newPath = Raphael.transformPath(departments[d]['coo'], transformationMatrix)
                    datas = {
                        dataName: departments[d].identifier,
                        dataInsee: d
                    };
                    node = this.createPath(departments[d].coo, deptOpts.attr.base, datas);
                    if (isFunction(deptOpts.onMouseOver)) {
                        node.mouseover(deptOpts.onMouseOver);
                    }
                    if (isFunction(deptOpts.onMouseOut)) {
                        node.mouseout(deptOpts.onMouseOut);
                    }
                    // node.hover(deptOpts['onMouseOver'], deptOpts['onMouseOut']);
                }
            }
        }

        if (!regionOpts.exclude.everything) {
            for (var r in regions) {
                if (regionOpts.exclude.list.indexOf(r) === -1) {
                    datas = {
                        dataName: regions[r].identifier,
                        dataInsee: r
                    };
                    node = this.createPath(regions[r].coo, regionOpts.attr.base, datas);
                    // node.hover(mapOfFrance.regionMouseOver, mapOfFrance.regionMouseOver);
                    // var newPath = Raphael.transformPath(regions[r]['coo'], transformationMatrix)
                }
            }
        }

        this.fset = this.paper.setFinish();
        this.fset.transform(this.opts.transformationMatrix);
    };

    return {
        MapOfFrance: MapOfFrance
    };

})(franceData);
