# RSR Docker Development Environment

## System setup

1. Install `docker`
2. Install `docker-compose`

## Starting Up

1. Run `docker-compose up --build`

2. Visit [http://localhost/](http://localhost/)

## i18n Translations

### Process

- Add the tags to all strings within RSR that should be translated
- Generate the .po file from Django (`python manage.py makemessages`)
- Upload the .po file into the [Transifex](https://www.transifex.com/) interface
- Select the languages to be supported with the translations
- Assign translators to a language, assuring that every language is covered
- Translators perform the work and submit the translated strings into transifex
- Ensure all languages completed and approved
- Download the new .po files for each language
- Add these into the RSR Codebase
- Run `python manage.py compilemessages` to generate `.mo` files from the `.po`
  files, which are used by Django's built-in gettext support.

This process works the same way whether for RSR or for RSR Up - however for Up,
we do not use .po files but an alternative Android format, the process otherwise
remains the same.

### Notes for developers

When tagging for translation there are some things that will make life a lot
easier for translators.

* Avoid " (double quotes) within a string marked for translation. Use ' (single
  quotes) where ever possible instead since " is escaped to \" in the .po file.
  This gotcha is common when HTML tags are part of the translation string.
  Example, write:

```html
By <a href='{{ register1_url }}'>registering</a> with Akvo, you will be able to:
```

* Keep text in {% blocktrans %} on one line, including the blocktrans tag
  itself. This is because otherwise all the whitespace is included in the
  translation text. This is especially painful if combined with tabs for
  indenting.

* Use dictionaries for string interpolation with dict keys that explain the
  meaning of the inserted value. This also allows for re-ordering of the
  inserted values. Example:

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

* As little HTML inside {% blocktrans %} as possible. Some HTML can't be avoided
  though. Use string interpolation in code to "inject" the translation string
  into a wrapping html tag:

```python
{
    'description: u'<p style="margin-left:0; padding-left:0; margin-top:1em; width:75%%;">%s</p>' % _(
        u'In-depth information about your project should be put in this section. '
        u'Use the Background, Project plan, Current status and Sustainability fields '
        u'to tell people more about the project.'
    )
}
```

Here is also shown the use of python's automatic concatenation of multiple
single line strings into one long string.

### Note for translators

If the referenced document is a .html file or it's obvious that the text is used
in a web context (tags in the text is a giveaway) all extra whitespace can be
ignored, particularly \n (newline) and \t (tab) characters that may appear in
certain cases. However in a few cases, e.g. email templates formatting of this
type may be relevant. Those files usually end in .txt

## FAQ

##### Q: How do I migrate or get a Django shell?

You can `exec` commands on the web host. `docker-compose exec web python
manage.py shell` for example.


##### Q: How do I access a partnersite?

You will need to add an entry to your `/etc/hosts` file (or Windows equivalent),
and point `<partner_hostname>.localakvoapp.org` to `127.0.0.1` - for example,
add this line to be able to access the EUTF partner site:

```
127.0.0.1 eutf.localakvoapp.org
```

##### Q: How do I update the Python package dependencies?

To temporarily install additional packages in the docker machine, you can run
`docker-compose exec web pip install <package_name>`. Note that this
installation is temporary, and all changes are lost when `docker-compose down`
is run.

To install add a new dependency, add it to `requirements.txt`.


##### Q: I get a 502! Why?

Ensure that RSR is running. Chances are, a 502 means that no RSR app is running.


##### Q: How do create a copy of the test/live DB for local testing?

See the instructions in the
[restore-elephantsql-dump-to-dev-env.sh](https://github.com/akvo/akvo-rsr/blob/develop/scripts/data/restore-elephantsql-dump-to-dev-env.sh#L3)
file.

## Helpful notes

* When you are done developing, run `docker-compose down` to stop and remove
  containers, networks, images, and volumes.

* Run `docker-compose exec web /bin/bash` to get a shell on the docker web host.

* The `akvo-rsr` repository from your local machine is synced to the virtual
  machine, and the RSR application will restart when you make code changes.

## Useful scripts

There are a variety of useful scripts in `scripts/devhelpers`.
