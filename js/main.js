var front = {};

var mapOfFrance = (function() {

    //private static method
    var isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    var construct = function(canvasId, width, height) {
        this.paper = new Raphael(canvasId, width, height);
        this.fset = null;
        this.opts = {
            transformationMatrix: 'm1 0 0 1 0 0',
            regionsOpts: {
                // possible attributs : http://raphaeljs.com/reference.html#Element.attr
                attr: {
                    base: {
                        'stroke': '#666'
                    }
                },
                exclude: {
                    all: false,
                    list: []
                }
            },
            deptOpts: {
                // possible attributs : http://raphaeljs.com/reference.html#Element.attr
                attr: {
                    base: {
                        'fill': '#d9dadb',
                        'stroke': '#888',
                        'cursor': 'pointer'
                    }
                },
                exclude: {
                    all: false,
                    list: []
                },
                onMouseOver: null,
                onMouseOut: null
            }
        };

    };

    //return raphael instance
    construct.prototype.getPaper = function() {
        return this.paper;
    }

    construct.prototype.setTransformationMatrix = function (transformationMatrix) {
        this['opts']['transformationMatrix'] = transformationMatrix;
        return this;
    }

    //change default attribut for departments
    //chainable
    construct.prototype.setDeptBaseAttr = function(attr) {
        this['opts']['deptOpts']['attr']['base'] = attr;
        return this;
    }

    //return default attributes of departements
    construct.prototype.getDeptBaseAttr = function() {
        return this['opts']['deptOpts']['attr']['base'];
    }

    //change default attribut for regions
    //chainable
    construct.prototype.setRegionsBaseAttr = function(attr) {
        this['opts']['regionsOpts']['attr']['base'] = attr;
        return this;
    }

    //return default attributes of regions
    construct.prototype.getRegionsBaseAttr = function() {
        return this['opts']['regionsOpts']['attr']['base'];
    }

    //exclude all regions from rendering
    //chainable
    construct.prototype.excludeRegions = function() {
        this['opts']['regionsOpts']['exclude']['all'] = true;
        return this;
    }

    //exclude all departments from rendering
    //chainable
    construct.prototype.excludeDepts = function() {
        this['opts']['deptOpts']['exclude']['all'] = true;
        return this;
    }

    //Set a custom list of departments to exclude from rendering
    //chainable
    construct.prototype.setDeptsExcludeList = function(excludeList) {
        this['opts']['deptOpts']['exclude']['list'] = excludeList;
        return this;
    }

    //Set a custom list of regions to exclude from rendering
    //chainable
    construct.prototype.setRegionsExcludeList = function(excludeList) {
        this['opts']['regionsOpts']['exclude']['list'] = excludeList;
        return this;
    }

    construct.prototype.createPath = function(coo, attr, datas) {
        var path = this.paper.path(coo);
        path.attr(attr);
        for (var k in datas) {
            path.data(k, datas[k])
        }
        return path;
    };

    construct.prototype.draw = function() {

        var departments = franceData['departments']; //shortcut
        var regions = franceData['regions']; //shortcut
        var deptOpts = this['opts']['deptOpts'];
        var regionOpts = this['opts']['regionsOpts'];
        var node;
        var datas;

        this.paper.setStart();

        if (!deptOpts['exclude']['all']) {
            for (var d in departments) {
                if (deptOpts['exclude']['list'].indexOf(d) === -1) {
                    // var newPath = Raphael.transformPath(departments[d]['coo'], transformationMatrix)
                    datas = {
                        'data-name': departments[d]['name'],
                        'data-insee': d
                    }
                    node = this.createPath(departments[d]['coo'], deptOpts['attr']['base'], datas)
                    if (isFunction(deptOpts['onMouseOver'])) {
                        node.mouseover(deptOpts['onMouseOver']);
                    }
                    if (isFunction(deptOpts['onMouseOut'])) {
                        node.mouseout(deptOpts['onMouseOut']);
                    }
                    // node.hover(deptOpts['onMouseOver'], deptOpts['onMouseOut']);
                }
            }
        }

        if (!regionOpts['exclude']['all']) {
            for (var r in regions) {
                if (regionOpts['exclude']['list'].indexOf(r) === -1) {
                    datas = {
                        'data-name': regions[r]['name'],
                        'data-insee': r
                    }
                    node = this.createPath(regions[r]['coo'], regionOpts['attr']['base'], datas)
                    // node.hover(mapOfFrance.regionMouseOver, mapOfFrance.regionMouseOver);
                    // var newPath = Raphael.transformPath(regions[r]['coo'], transformationMatrix)
                }
            }
        }

        this.fset = this.paper.setFinish();
        this.fset.transform(this['opts']['transformationMatrix']);
    };

    return construct;

})();

(function (context) {
    "use strict";

    var ui = {
        init : function () {

            var overAttr = {
                'fill': 'teal',
                'stroke': '#888',
                'cursor': 'pointer'
            }
            var myMap = new mapOfFrance('canvas-france', 590, 570);

            myMap['opts']['deptOpts']['onMouseOver'] = function() {
                this.attr(overAttr);
            };

            myMap['opts']['deptOpts']['onMouseOut'] = function() {
                this.attr(myMap.getDeptBaseAttr());
            };

            myMap.setDeptsExcludeList(['75', '77', '78', '91', '92', '93', '94', '95'])
            // myMap.setTransformationMatrix('m0.75 0 0 0.75 200 0');
            myMap.excludeRegions().draw();
        }
    };

    context.ui = ui;

})(front)

onDomReady(front.ui.init);
