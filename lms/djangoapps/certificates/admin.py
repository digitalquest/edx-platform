"""
django admin pages for certificates models
"""
from django.contrib import admin
from config_models.admin import ConfigurationModelAdmin
from certificates.models import (
    CertificateGenerationConfiguration,
    CertificateHtmlViewConfiguration,
    BadgeImageConfiguration,
    CertificateTemplate,
    CertificateTemplateAsset,
)


class CertificateTemplateAdmin(admin.ModelAdmin):
    """
    Django admin customizations for CertificateTemplate model
    """
    list_display = ('name', 'description', 'organization_id', 'course_key', 'mode', 'is_active')


class CertificateTemplateAssetAdmin(admin.ModelAdmin):
    """
    Django admin customizations for CertificateTemplateAsset model
    """
    list_display = ('description', '__unicode__')


admin.site.register(CertificateGenerationConfiguration)
admin.site.register(CertificateHtmlViewConfiguration, ConfigurationModelAdmin)
admin.site.register(BadgeImageConfiguration)
admin.site.register(CertificateTemplate, CertificateTemplateAdmin)
admin.site.register(CertificateTemplateAsset, CertificateTemplateAssetAdmin)
