define([
    'coreJS/adapt'
], function (Adapt) {

    var onDataReady = function(){

        //listen for blocks completion events
        Adapt.blocks.on('change:_isComplete', updateProgress);

    }

    var updateProgress = function(model) {

        var course = Adapt.course;
        var currentProgress = parseInt(Adapt.offlineStorage.get('score'));

        //ignore if progress is already 100
        if(currentProgress && currentProgress===100)
            return;

        //get blocks list
        var blocks = Adapt.blocks;

        //exclude optional blocks
        var non_optional_blocks = blocks.filter(function(m){ return !m.get('_isOptional') });

        //get completion values as array
        var values = _.countBy(_.map(non_optional_blocks, function(m){ return m.get('_isComplete') }));

        //count completed ones
        var completed = values['true'] || 0;

         //calculate progress
        var progress = Math.floor(completed * 100 / non_optional_blocks.length);

        //set new calculated progress only if is greater than current
        if(!currentProgress || progress > currentProgress)
            Adapt.offlineStorage.set("score", progress, 0, 100);

        /*
        
        Experimenting with a more detailed progress calculation
        var getProgressTree = function (m) {

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
                children.push(getProgressTree(c[i]));
            }

            //group children by completed and not completed
            var groups = _.groupBy(c, function (m) { return m.get('_isComplete') });

            //calculate progress
            var p = (groups['true']) ? Math.floor(groups['true'].length / children.length) * 100 : 0;

            return {
                type: m.get('_type'),
                complete: m.get('_isComplete'),
                progress: p,
                children: children
            };
        }

        var tree = getProgressTree(course);
        console.log(tree);
        
        */

    }

    Adapt.on('app:dataReady', onDataReady);

});