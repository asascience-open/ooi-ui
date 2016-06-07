/*
 * Created by M@Campbell
 *
 * Main Parent for all filters.
 *
 * @method getFilters()
 *      Return the object of all filters.
 *
 * @method resetCollection()
 *      Resets the collection with all the filters and ranges.
 *
 * The following have respective filter types (array, instrument, stream, etc)
 * @method addToFilters(item)
 *      Add a string to the array of filters.
 *
 * @method indexOfFilters(item)
 *      Checked if the string item is in the array of filters.
 *      returns index, -1 if none.
 *
 * @method removeFromFilters(item)
 *      Removes the string item from the array of filters.
 *
 * @method getTimeRange()
 *      Return the time range object, with min and max
 *
 * @method setTimeRange(min, max)
 *      Sets the time range object, and returns the global
 *      time range.
 *
 *
 * @global filters
 * @global timeRange
 */

// SET TO FALSE TO DISABLE SERVER SIDE COLLECTION RESET
var COLLECTION_RESET = true;

var filters = [];
var streamFilters = [];
var instrumentFilters = [];
var timeRange = {};

var FilterParentView = SearchSidebarView.extend({
    events: {
        'click .js-collapse': 'collapsePanel'
    },
    collapsePanel: function(event) {
        event.stopImmediatePropagation();
        var target = $(event.target).data('target');
        $(target).toggleClass('in');
    },
    getFilters: function(options) {
        var filters = {
            strings: [
                this.getArrayFilters(),
                this.getInstrumentFilters(),
                this.getStreamFilters()
            ],
            timeRange: this.getTimeRange()
        };
        return filters;
    },
    resetCollection: function() {
        if (COLLECTION_RESET) {
            var filters = this.getFilters();
            this.collection.fetch({
                data: {
                    search: filters.strings.join(' '),
                    startDate: filters.timeRange.min,
                    endDate: filters.timeRange.max
                }
            });
        }
    },
    getArrayFilters: function() {
        return filters.join(' ');
    },
    addToArrayFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        filters.push(item);
        return filters;
    },
    indexOfArrayFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        return filters.indexOf(item);
    },
    removeFromArrayFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }

        var index = filters.indexOf(item);
        if (index !== -1) {
            filters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },

    getTimeRange: function() {
        if (timeRange === {}) {
            return null;
        } else {
           return timeRange;
        }
    },
    setTimeRange: function(min, max) {
        if (!_.isUndefined(min) && !_.isUndefined(max) ){
            timeRange = {
                min: min.valueOf(),
                max: max.valueOf()
            }
            return timeRange;
        }else{
            return null;
        }
    },
    getStreamFilters: function() {
        return streamFilters.join(' ');
    },
    addToStreamFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        streamFilters.push(item);
        return streamFilters;
    },
    indexOfStreamFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        return streamFilters.indexOf(item);
    },
    removeFromStreamFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }

        var index = streamFilters.indexOf(item);
        if (index !== -1) {
            streamFilters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },
    getInstrumentFilters: function() {
        return instrumentFilters.join(' ');
    },
    addToInstrumentFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        instrumentFilters.push(item);
        return instrumentFilters;
    },
    indexOfInstrumentFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        return instrumentFilters.indexOf(item);
    },
    removeFromInstrumentFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }

        var index = instrumentFilters.indexOf(item);
        if (index !== -1) {
            instrumentFilters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },

});


// Main view for the filters.
var FilterInputView = FilterParentView.extend({
    onAfterRender: function() {

        var assetFilterView = new AssetFilterView({el: '#assetFilters', collection: this.collection});
        this.$el.find('#assetFilters').append(assetFilterView.render().el);

        var rangeFilterView = new RangeFilterView({el: '#rangeFilters', collection: this.collection});
        this.$el.find('#rangeFilters').append(rangeFilterView.render().el);

        var streamFilterView = new StreamFilterView({el: '#streamFilters', collection: this.collection});
        this.$el.find('#streamFilters').append(streamFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/FilterInput.html']
});
