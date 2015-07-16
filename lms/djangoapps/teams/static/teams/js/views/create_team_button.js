;(function (define) {
    'use strict';
    define([
        'backbone',
        'teams/js/views/create_team',
        'text!teams/templates/create-team-button.underscore'
    ], function (Backbone, CreateTeamView, create_team_button_template) {
        return Backbone.View.extend({
            events: {
                'click a.create-team': 'showCreateTeamForm'
            },

            initialize: function (options) {
                this.template = _.template(create_team_button_template);
                this.teamParams = options.teamParams;
            },

            render: function () {
                this.$el.html(this.template({}));
                return this;
            },

            showCreateTeamForm: function (event) {
                event.preventDefault();
                var view = new CreateTeamView({
                    el: $('.teams-content'),
                    teamParams: _.extend(this.teamParams, {href: Backbone.history.location.href})
                });
                view.render();
            }
        });
    });
}).call(this, define || RequireJS.define);
