# -*- coding: utf-8 -*-


from django.db import models, migrations
import akvo.rsr.fields
import akvo.rsr.models.partner_site


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0004_auto_20150415_1622'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='organisation',
            options={'verbose_name': 'organisation', 'verbose_name_plural': 'organisations', 'permissions': (('user_management', 'Can manage users'),)},
        ),
        migrations.AlterModelOptions(
            name='partnersite',
            options={'ordering': ('organisation__name',), 'verbose_name': 'Akvo page', 'verbose_name_plural': 'Akvo pages'},
        ),
        migrations.AlterField(
            model_name='organisation',
            name='language',
            field=akvo.rsr.fields.ValidXMLCharField(default=b'en', help_text='The main language of the organisation', max_length=2, verbose_name='language', choices=[(b'de', b'German'), (b'en', b'English'), (b'nl', b'Dutch'), (b'es', b'Spanish'), (b'fr', b'French'), (b'ru', b'Russian')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='organisation',
            name='new_organisation_type',
            field=models.IntegerField(default=22, help_text='Check that this field is set to an organisation type that matches your organisation.', db_index=True, verbose_name='IATI organisation type', choices=[('10', '10 - Government'), ('15', '15 - Other Public Sector'), ('21', '21 - International NGO'), ('22', '22 - National NGO'), ('23', '23 - Regional NGO'), ('30', '30 - Public Private Partnership'), ('40', '40 - Multilateral'), ('60', '60 - Foundation'), ('70', '70 - Private Sector'), ('80', '80 - Academic, Training and Research')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='about_box',
            field=akvo.rsr.fields.ValidXMLTextField(help_text='Enter HTML that will make up the top left box of the home page. (500 characters)<p>    Any text added should be wrapped in 2 &lt;div&gt; tags, an outer one specifying     position and width of the text, and an inner for formatting of the text .</p><p>    The Outer &lt;div&gt; tag can use the classes <code>quarter, half,     three_quarters and full</code> to specify the    width of the text. It can use the classes <code>bottom</code> and     <code>right</code> to specify a position other than top left.</p><p>    The Inner &lt;div&gt; tag can use the class <code>text_bg</code> to create a     semi-transparent text background if a background image will be uploaded.     Any other inline styles can also be used within the inner &lt;div&gt;. The     tags &lt;h1&gt;, &lt;h3&gt;, &lt;h5&gt; and &lt;a&gt; are blue, while     &lt;p&gt; tags are black by default. Use the classes <code>first</code> and     <code>last</code> with &lt;p&gt; tags to reduce the margins above or below     respectively.</p><p>    Add additional styling inline, or upload a .css stylesheet in the Stylesheet     setting above. <em>Tip:</em> When using a .css file, use the #about_box ID     selector to apply a style only to the About box.</p>', max_length=500, verbose_name='about box text', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='cname',
            field=akvo.rsr.fields.NullCharField(null=True, max_length=100, blank=True, help_text='<p>Enter a custom domain name for accessing the Akvo page, for example <i>projects.mydomain.org</i>. Optional. Requires additional DNS setup.</p>', unique=True, verbose_name='CNAME'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='custom_logo',
            field=models.FileField(help_text='<p>Upload a logo file for the logo at the top of the Akvo page. By default logo of the organisation belonging to the Akvo Page will be displayed.</p>', upload_to=akvo.rsr.models.partner_site.custom_logo_path, verbose_name='organisation banner logo', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='custom_return_url',
            field=models.URLField(help_text='<p>Enter the full URL (including http://) for the page to which users should be returned when leaving the Akvo page.</p>', verbose_name='Return URL', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='hostname',
            field=akvo.rsr.fields.ValidXMLCharField(help_text='<p>Your hostname is used in the default web address of your Akvo page. The web address created from  the hostname <em>myorganisation</em> would be <em>http://myorganisation.akvoapp.org/</em>.</p>', unique=True, max_length=50, verbose_name='hostname'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='notes',
            field=akvo.rsr.fields.ValidXMLTextField(default=b'', verbose_name='Akvo page notes', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='partnersite',
            name='partner_projects',
            field=models.BooleanField(default=True, help_text='Uncheck to list all projects on this Akvo page.', verbose_name='Show only projects of partner'),
            preserve_default=True,
        ),
    ]
