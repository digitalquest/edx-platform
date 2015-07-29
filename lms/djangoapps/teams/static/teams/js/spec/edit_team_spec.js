define([
    'jquery',
    'backbone',
    'common/js/spec_helpers/ajax_helpers',
    'teams/js/views/edit_team'
], function ($, Backbone, AjaxHelpers, TeamEditView) {
    'use strict';

    describe('EditTeam', function () {
        var teamEditView;

        beforeEach(function () {
            setFixtures('<div class="teams-content"></div>');
            spyOn(Backbone.history, 'navigate');
            teamEditView = new TeamEditView({
                el: $('.teams-content'),
                teamParams: {
                    topicId: 'awesomeness',
                    topicName: 'Awesomeness',
                    languages: [['a', 'aaa'], ['b', 'bbb']],
                    countries: [['c', 'ccc'], ['d', 'ddd']]
                }
            }).render();

            teamEditView.$('.wrapper-msg').hide();
        });

        it('can create a team', function () {
            var requests = AjaxHelpers.requests(this);

            teamEditView.$('.u-field-name input').val('TeamName');
            teamEditView.$('.u-field-textarea textarea').val('TeamDescription');
            teamEditView.$('.u-field-language select').val('a').attr("selected", "selected");
            teamEditView.$('.u-field-country select').val('c').attr("selected", "selected");

            teamEditView.$('.create-team.form-actions .action-primary').click();
            AjaxHelpers.respondWithJson(requests, {
                "id": "tn",
                "name": "TeamName",
                "is_active": true,
                "course_id": "a/b/c",
                "topic_id": "awesomeness",
                "date_created": "2015-07-29T09:59:37.528Z",
                "description": "TeamDescription",
                "country": "c",
                "language": "a",
                "membership": []
            });

            expect(teamEditView.$('.wrapper-msg').is(':visible')).toBeFalsy();
            expect(Backbone.history.navigate.calls[0].args).toContain('topics/awesomeness');
        });

        it('shows validation error message', function () {
            teamEditView.$('.create-team.form-actions .action-primary').click();

            expect(teamEditView.$('.wrapper-msg').is(':visible')).toBeTruthy();
            expect(teamEditView.$('.wrapper-msg .title').text().trim()).toBe("Oops!");
            var errorMessage = "Your team could not be created. Check the highlighted fields below and try again.";
            expect(teamEditView.$('.wrapper-msg .copy').text().trim()).toBe(errorMessage);
        });

        it("shows an error message for HTTP 500", function () {
            var requests = AjaxHelpers.requests(this);

            teamEditView.$('.u-field-name input').val('TeamName');
            teamEditView.$('.u-field-textarea textarea').val('TeamDescription');

            teamEditView.$('.create-team.form-actions .action-primary').click();
            AjaxHelpers.respondWithError(requests);

            expect(teamEditView.$('.wrapper-msg .copy').text().trim()).toBe("An error occurred. Please try again.");
        });

        it("changes route on cancel click", function () {
            teamEditView.$('.create-team.form-actions .action-cancel').click();
            expect(Backbone.history.navigate.calls[0].args).toContain('topics/awesomeness');
        });
    });
});
