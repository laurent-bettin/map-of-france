var front = (function () {
    "use strict";

    var ui = {
        init : function () {

            var overAttr = {
                fill: 'teal',
                stroke: '#888',
                cursor: 'pointer'
            };
            var myMap = new mapoffrance.MapOfFrance('canvas-france', 590, 570);

            myMap.opts.deptOpts.onMouseOver = function() {
                this.attr(overAttr);
                console.log(this.data('dataName'));
            };

            myMap.opts.deptOpts.onMouseOut = function() {
                this.attr(myMap.getDeptBaseAttr());
            };

            myMap.setDeptsExcludeList(['75', '77', '78', '91', '92', '93', '94', '95']);
            // myMap.setTransformationMatrix('m0.75 0 0 0.75 200 0');
            myMap.excludeRegions().draw();
        }
    };

    return ui;

})();

onDomReady(front.init);
