var front = (function () {
    "use strict";

    var ui = {
        init : function () {

            var myMap = new mapoffrance.MapOfFrance('canvas-france', 590, 570);

            myMap.setDeptBaseAttr({
                fill: 'teal',
                stroke: '#f00'
            })
            .setCustomExcludeList(['FR101', 'FR102', 'FR103', 'FR104', 'FR105', 'FR106', 'FR107', 'FR108',
                'FR711', 'FR712', 'FR713', 'FR714', 'FR715', 'FR716', 'FR717', 'FR718'])
            .draw();

        }
    };

    return ui;

})();

onDomReady(front.init);
