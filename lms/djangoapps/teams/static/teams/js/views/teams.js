;(function (define) {
    'use strict';
    define([
        'backbone',
        'teams/js/views/team_card',
        'common/js/components/views/paginated_view',
        'teams/js/views/create_team_button'
    ], function (Backbone, TeamCardView, PaginatedView, CreateTeamButtonView) {
        var TeamsView = PaginatedView.extend({
            type: 'teams',

            initialize: function (options) {
                this.itemViewClass = TeamCardView.extend({
                    router: options.router,
                    maxTeamSize: options.maxTeamSize
                });
                PaginatedView.prototype.initialize.call(this);
                this.teamParams = options.teamParams;
            },

            render: function () {
                PaginatedView.prototype.render.call(this);

                var createTeamButtonView = new CreateTeamButtonView({
                    teamParams: _.extend(this.teamParams, {href: Backbone.history.location.href})
                });
                this.$el.append(createTeamButtonView.$el);
                createTeamButtonView.render();

                return this;
            }
        });
        return TeamsView;
    });
}).call(this, define || RequireJS.define);
