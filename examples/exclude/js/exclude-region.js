var front = (function () {
    "use strict";

    var ui = {
        init : function () {

            var myMap = new mapoffrance.MapOfFrance('canvas-france', 590, 570);

            myMap.excludeRegions().draw();
        }
    };

    return ui;

})();

onDomReady(front.init);
