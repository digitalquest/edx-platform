;(function (define) {
'use strict';

define(['backbone',
        'underscore',
        'gettext',
        'js/views/fields',
        'teams/js/models/team',
        'text!teams/templates/edit-team.underscore'],
       function (Backbone, _, gettext, FieldViews, TeamModel, edit_team_template) {
           return Backbone.View.extend({

               maxTeamNameLength: 255,
               maxTeamDescriptionLength: 300,

               events: {
                   "click .action-primary": "createTeam",
                   "click .action-cancel": "cancelTeam"
               },

               initialize: function(options) {
                   this.courseId = options.teamParams.courseId;
                   this.teamsUrl = options.teamParams.teamsUrl;
                   this.topicId = options.teamParams.topicId;
                   this.languages = options.teamParams.languages;
                   this.countries = options.teamParams.countries;

                   _.bindAll(this, "cancelTeam", "createTeam");

                   this.teamNameField = new FieldViews.TextFieldView({
                       model: new TeamModel(),
                       title: gettext("Team Name (Required) *"),
                       valueAttribute: 'name',
                       helpMessage: gettext("A name that identifies your team (maximum 255 characters).")
                   });

                   this.teamDescriptionField = new FieldViews.TextareaFieldView({
                       model: new TeamModel(),
                       title: gettext("Team Description (Required) *"),
                       valueAttribute: 'description',
                       editable: 'always',
                       showMessages: false,
                       descriptionMessage: gettext("A short description of the team to help other learners understand the goals or direction of the team (maximum 300 characters).")
                   });

                   this.optionalDescriptionField = new FieldViews.ReadonlyFieldView({
                       model: new TeamModel(),
                       title: gettext("Optional Characteristics"),
                       valueAttribute: 'optional_description',
                       helpMessage: gettext("Help other learners decide whether to join your team by specifying some characteristics for your team. Choose carefully, because fewer people might be interested in joining your team if it seems too restrictive. You cannot change these characteristics after you create the team.")
                   });

                   this.teamLanguageField = new FieldViews.DropdownFieldView({
                       model: new TeamModel(),
                       title: gettext("Language"),
                       valueAttribute: 'language',
                       required: false,
                       showMessages: false,
                       titleIconName: 'fa-comment-o',
                       options: this.languages,
                       helpMessage: gettext("The language that team members primarily use to communicate with each other.")
                   });

                   this.teamCountryField = new FieldViews.DropdownFieldView({
                       model: new TeamModel(),
                       title: gettext('Country'),
                       valueAttribute: 'country',
                       required: false,
                       showMessages: false,
                       titleIconName: 'fa-globe',
                       options: this.countries,
                       helpMessage: gettext("The country that team members primarily identify with.")
                   });
               },

               render: function() {
                   this.$el.html(_.template(edit_team_template)({}));
                   this.set(this.teamNameField, '.team-required-fields');
                   this.set(this.teamDescriptionField, '.team-required-fields');
                   this.set(this.optionalDescriptionField, '.team-optional-fields');
                   this.set(this.teamLanguageField, '.team-optional-fields');
                   this.set(this.teamCountryField, '.team-optional-fields');
                   return this;
               },

               set: function(view, selector) {
                   this.$el.find(selector).append(view.$el);
                   view.render();
               },

               createTeam: function () {
                   var teamName = this.teamNameField.fieldValue();
                   var teamDescription = this.teamDescriptionField.fieldValue();
                   var teamLanguage = this.teamLanguageField.fieldValue();
                   var teamCountry = this.teamCountryField.fieldValue();

                   var validation = this.validateTeamData(teamName, teamDescription);
                   if (validation.status === false) {
                       this.showMessage(validation.message);
                       return;
                   }

                   var data = {
                       course_id: this.courseId,
                       topic_id: this.topicId,
                       name: teamName,
                       description: teamDescription,
                       language: _.isNull(teamLanguage) ? '' : teamLanguage,
                       country: _.isNull(teamCountry) ? '' : teamCountry
                   };

                   // Send AJAX request to Teams API
                   var view = this;
                   $.ajax({
                       type: 'POST',
                       url: this.teamsUrl,
                       data: data
                   }).done(function () {
                       Backbone.history.navigate("topics/" + view.topicId, {trigger: true});
                   }).fail(function (jqXHR) {
                       view.showMessage(gettext('An error occurred. Please try again.'));
                   });
               },

               validateTeamData: function (teamName, teamDescription) {
                   var status = true,
                       message = gettext("Your team could not be created. Check the highlighted fields below and try again.");

                   this.teamNameField.unhighlightField();
                   this.teamDescriptionField.unhighlightField();

                   if (_.isEmpty(teamName.trim()) ) {
                       status = false;
                       this.teamNameField.highlightFieldOnError();
                   } else if (teamName.length > this.maxTeamNameLength) {
                       status = false;
                       this.teamNameField.highlightFieldOnError();
                   }

                   if (_.isEmpty(teamDescription.trim()) ) {
                       status = false;
                       this.teamDescriptionField.highlightFieldOnError();
                   } else if (teamDescription.length > this.maxTeamDescriptionLength) {
                       status = false;
                       this.teamDescriptionField.highlightFieldOnError();
                   }

                   return {
                       status: status,
                       message: message
                   };
               },

               showMessage: function (message) {
                   this.$('.wrapper-msg').show();
                   this.$('.msg-content .copy p').text(message);
               },

               cancelTeam: function () {
                   Backbone.history.navigate("topics/" + this.topicId, {trigger: true});
               }
           });
       });
}).call(this, define || RequireJS.define);
