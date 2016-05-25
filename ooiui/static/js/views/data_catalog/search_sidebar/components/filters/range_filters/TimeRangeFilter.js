/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var TimeRangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        var _this = this;
        $.when(this.collection.fetch({data: {search: _this.getFilters()}})).done(function() {
            var dateRangeBounds = _this._getDateRangeSliderBounds(_this.collection.models);
            _this.setTimeRange(dateRangeBounds.min, dateRangeBounds.max);
            ooi.trigger('TimeRangeFilterView:addToTimeRange', _this.getTimeRange());


            _this.$el.find('#slider').dateRangeSlider({
                bounds: dateRangeBounds,
                defaultValues: dateRangeBounds,
            }).bind('valuesChanged', function(event, data) {
                var startDate = data.values.min.valueOf(),
                    endDate = data.values.max.valueOf();

                //_this.collection.fetch({data: {search: _this.getFilters(), startDate: startDate, endDate: endDate}});

                _this.setTimeRange(startDate, endDate);
                ooi.trigger('TimeRangeFilterView:addToTimeRange', _this.getTimeRange());
            });
        });

    },
    _getDateRangeSliderBounds: function (s) {
        var temp, min, max, bounds = {};
        $.each(s, function (i, v) {
            temp = new Date(v.attributes.end);
            if (min === undefined)
                min = temp;
            else if (max === undefined) {
                if (temp > min)
                    max = temp;
                else {
                    max = min;
                    min = temp;
                }
            }
            else if (temp < min)
                min = temp;
            else if (temp > max)
                max = temp;
        });
        return {
            min : min,
            max : max
        }
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/TimeRangeFilter.html']
});
