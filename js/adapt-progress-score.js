define([
    'coreJS/adapt'
], function (Adapt) {

    var calculateProgress = function(model) {

        var course = Adapt.course;

        var getModelTree = function (m) {

            //create data model
            var obj = {
                type: m.get('_type'),
                complete: m.get('_isComplete'),
                progress: 0,
                children: []
            }

            //iterate children
            var children = [];
            var c = m.getChildren().models;
            for (var i = 0; i < c.length; i++) {
                children.push(getModelTree(c[i]));
            }

            //group children by completed and not completed
            var groups = _.groupBy(c, function (m) { return m.get('_isComplete') });

            //calculate progress
            var p = (groups['true']) ? groups['true'].length * 100 / children.length : 0;

            return {
                type: m.get('_type'),
                complete: m.get('_isComplete'),
                progress: p,
                children: children
            };
        }

        var tree = getModelTree(course);
        //console.log(tree);
        Adapt.offlineStorage.set("score", tree.progress, 0, 100);

    }

    Adapt.on('router:page', calculateProgress);
    Adapt.on('router:menu', calculateProgress);

});