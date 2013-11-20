## Notes for developers
When tagging for translation there are some things that will make life a lot easier for translators. 

* Avoid " (double quotes) within a string marked for translation. Use ' (single quotes) where ever possible instead since " is escaped to \" in the .po file. This gotcha is common when HTML tags are part of the translation string. Example, write:
```html
By <a href='{{ register1_url }}'>registering</a> with Akvo, you will be able to:
```

* Keep text in {% blocktrans %} on one line, including the blocktrans tag itself. This is because otherwise all the whitespace is included in the translation text. This is especially painful if combined with tabs for indenting.

* Use dictionaries for string interpolation with dict keys that explain the meaning of the inserted value. This also allows for re-ordering of the inserted values. Example:
```python
msg = u'Invoice %(invoice_id)d could not be voided. It is already %(invoice_status)s.' % dict(
    invoice_id=invoice.pk, invoice_status=invoice.get_status_display().lower()
)
```
is much better than:
```python
msg = u'Invoice %d could not be voided. It is already %s.' % (
    invoice.pk, invoice.get_status_display().lower()
)
```

* As little HTML inside {% blocktrans %} as possible. Some HTML can't be avoided though. Use string interpolation in code to "inject" the translation string into a wrapping html tag:
```python
{
    'description: u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
        u'In-depth information about your project should be put in this section. '
        u'Use the Background, Project plan, Current status and Sustainability fields '
        u'to tell people more about the project.'
    )
}
```
Here is also shown the use of python's automatic concatenation of multiple single line strings into one long string.

## Note for translators
If the referenced document is a .html file or it's obvious that the text is used in a web context (tags in the text is a giveaway) all extra whitespace can be ignored, particularly \n (newline) and \t (tab) characters that may appear in certain cases. However in  a few cases, e.g. email templates formatting of this type may be relevant. Those files usually end in .txt