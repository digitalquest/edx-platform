"""Tests of comprehensive theming."""

from django.conf import settings
from django.test import TestCase

from path import path

from openedx.core.djangoapps.theming.test_util import with_comp_theme
from openedx.core.lib.tempdir import mkdtemp_clean


class TestComprehensiveTheming(TestCase):
    """Test comprehensive theming."""

    @with_comp_theme(settings.REPO_ROOT / 'themes/red-theme')
    def test_red_footer(self):
        resp = self.client.get('/')
        self.assertEqual(resp.status_code, 200)
        # This string comes from footer.html
        self.assertContains(resp, "super-ugly")
        # This string comes from header.html
        self.assertContains(resp, "This file is only for demonstration, and is horrendous!")

    def test_theme_outside_repo(self):
        # Need to create a temporary theme, and defer decorating the function
        # until it is done, which leads to this strange nested-function style
        # of test.

        # Make a temp directory as a theme.
        tmp_theme = path(mkdtemp_clean())
        template_dir = tmp_theme / "lms/templates"
        template_dir.makedirs()
        with open(template_dir / "footer.html", "w") as footer:
            footer.write("<footer>TEMPORARY THEME</footer>")

        @with_comp_theme(tmp_theme)
        def do_the_test(self):
            resp = self.client.get('/')
            self.assertEqual(resp.status_code, 200)
            self.assertContains(resp, "TEMPORARY THEME")

        do_the_test(self)
