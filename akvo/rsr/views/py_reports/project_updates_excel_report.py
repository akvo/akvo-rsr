from akvo.rsr.models import Project
from datetime import datetime
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Fill, Color, Alignment

from . import utils


@login_required
def render_report(request, project_id):
    project = get_object_or_404(Project, pk=project_id)

    wb = Workbook()
    ws = wb.new_sheet('UpdatesTable')
    ws.set_col_style(1, Style(size=17))
    ws.set_col_style(2, Style(size=50))
    ws.set_col_style(3, Style(size=35))
    ws.set_col_style(4, Style(size=27))
    ws.set_col_style(5, Style(size=19))
    ws.set_col_style(6, Style(size=19))
    ws.set_col_style(7, Style(size=19))
    ws.set_col_style(8, Style(size=19))
    ws.set_col_style(9, Style(size=25))
    ws.set_col_style(10, Style(size=25))
    ws.set_col_style(11, Style(size=25))
    ws.set_col_style(12, Style(size=19))
    ws.set_col_style(13, Style(size=19))
    ws.set_col_style(14, Style(size=48.5))

    # r1
    ws.set_row_style(1, Style(size=40.5))
    ws.range('A1', 'B1').merge()
    ws.set_cell_style(1, 1, Style(font=Font(bold=True, size=24)))
    ws.set_cell_value(1, 1, 'Project Updates Review')

    # r2
    ws.set_cell_style(2, 1, Style(font=Font(bold=True, size=13)))
    ws.set_cell_value(2, 1, 'Project title')
    ws.set_cell_style(2, 2, Style(font=Font(bold=True, size=13)))
    ws.set_cell_value(2, 2, project.title)

    # r3
    ws.set_cell_style(3, 1, Style(font=Font(bold=True, size=13)))
    ws.set_cell_value(3, 1, 'Project #')
    ws.set_cell_style(3, 2, Style(
        font=Font(bold=True, size=13), alignment=Alignment(horizontal='left')))
    ws.set_cell_value(3, 2, project.id)

    # r5
    ws.set_row_style(5, Style(size=36))
    for col in range(1, 15):
        ws.set_cell_style(5, col, Style(
            font=Font(bold=True, size=13),
            alignment=Alignment(vertical='center'),
            fill=Fill(background=Color(211, 211, 211))
        ))
    ws.set_cell_value(5, 1, 'Update title')
    ws.set_cell_value(5, 2, 'Update text')
    ws.set_cell_value(5, 3, 'Photo')
    ws.set_cell_value(5, 4, 'Photo caption')
    ws.set_cell_value(5, 5, 'Photo credit')
    ws.set_cell_value(5, 6, 'Video')
    ws.set_cell_value(5, 7, 'Video caption')
    ws.set_cell_value(5, 8, 'Video credit')
    ws.set_cell_value(5, 9, 'Created at')
    ws.set_cell_value(5, 10, 'Last modified date')
    ws.set_cell_value(5, 11, 'Event date')
    ws.set_cell_value(5, 12, 'First name')
    ws.set_cell_value(5, 13, 'Last name')
    ws.set_cell_value(5, 14, 'URL')

    # r6
    row = 6
    for update in project.project_updates.all():
        for col in range(1, 9):
            ws.set_cell_style(row, col, Style(alignment=Alignment(wrap_text=True, vertical='top')))
        for col in range(9, 15):
            ws.set_cell_style(row, col, Style(alignment=Alignment(vertical='top')))
        ws.set_cell_value(row, 1, update.title)
        ws.set_cell_value(row, 2, update.text)
        ws.set_cell_value(row, 3, 'https://rsr.akvo.org/media/{}'.format(update.photo) if update.photo else '')
        ws.set_cell_value(row, 4, update.photo_caption)
        ws.set_cell_value(row, 5, update.photo_credit)
        ws.set_cell_value(row, 6, update.video)
        ws.set_cell_value(row, 7, update.video_caption)
        ws.set_cell_value(row, 8, update.video_credit)
        ws.set_cell_value(row, 9, update.created_at)
        ws.set_cell_value(row, 10, update.last_modified_at)
        ws.set_cell_value(row, 11, update.event_date)
        ws.set_cell_value(row, 12, update.user.first_name)
        ws.set_cell_value(row, 13, update.user.last_name)
        ws.set_cell_value(row, 14, 'https://{}{}'.format(settings.RSR_DOMAIN, update.get_absolute_url()))
        row += 1

    filename = '{}-{}-updates-table-report.xlsx'.format(
        datetime.today().strftime('%Y%b%d'), project.id)

    return utils.make_excel_response(wb, filename)
