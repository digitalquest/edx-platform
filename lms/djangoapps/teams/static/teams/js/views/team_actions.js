;(function (define) {
    'use strict';
    define([
        'backbone',
        'teams/js/views/create_team',
        'text!teams/templates/team-actions.underscore'
    ], function (Backbone, CreateTeamView, team_actions_template) {
        return Backbone.View.extend({
            events: {
                'click a.browse-teams': 'browseTeams',
                'click a.search-team-descriptions': 'searchTeamDescriptions',
                'click a.create-team': 'showCreateTeamForm'
            },

            initialize: function (options) {
                this.template = _.template(team_actions_template);
                this.teamParams = options.teamParams;
            },

            render: function () {
                this.$el.html(this.template({}));
                return this;
            },

            browseTeams: function (event) {
                event.preventDefault();
                Backbone.history.navigate('browse', {trigger: true});
            },

            searchTeamDescriptions: function (event) {
                event.preventDefault();
                // TODO! Will navigate to correct place once required functionality is available
                Backbone.history.navigate('browse', {trigger: true});
            },

            showCreateTeamForm: function (event) {
                event.preventDefault();
                this.renderTeamForm();
            },

            renderTeamForm: function () {
                var view = new CreateTeamView({
                    el: $('.teams-content'),
                    teamParams: this.teamParams
                });
                view.render();
                Backbone.history.navigate('topics/' + this.teamParams.topicId + '/create_new_team', {replace: true});
            }
        });
    });
}).call(this, define || RequireJS.define);
