# Report Generation

## Report definition

[Report] model is used to store report definitions. Some attributes of the Report model that need to be considered
- [`url`], parameterized path for downloading the report.
- [`formats`], available document format that can be downloaded.
- [`organisations`], restrict access to only employees of related organisations.

## Formats

The following are libraries used to produce document formats
- [WeasyPrint] is used to generate PDF documents
- [python-docx] is used to generate DOCX documents
- [PyExcelerate] is used to  generate XLSX documents

## Levels

Reports can exist at several levels and are defined using the [`url`] attribute in the [Report] model.
- project level, url attribute contains `{project}` parameter
- program level, url attribute contains `{program}` parameter
- organisation level, url attribute contains `{organisation}` parameter

## Creating new report

The following are the steps that must be taken to create a new report (not necessarily in order)
- Create a view handler that is used to generate the report. Usually placed in the [`py_reports`](#akvo.rsr.views.py_reports) package.
- Define the [url routing](#akvo.urls) for the view handler.
- Create a new [Report] object and set the [`url`] attribute using the same pattern as the url routing for the view handler.


[Report]: #Report
[`url`]: #Report.url
[`formats`]: #Report.formats
[`organisations`]: #Report.organisations
[WeasyPrint]: https://weasyprint.org/
[python-docx]: https://python-docx.readthedocs.io/
[PyExcelerate]: https://github.com/kz26/PyExcelerate
