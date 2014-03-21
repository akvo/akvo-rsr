# -*- coding: utf-8 -*-

# From http://datadev.aidinfolabs.org/data/codelist/OrganisationType.csv
# Fields: code, name

IATI_LIST_ORGANISATION_TYPE = (
    (10, u'Government'),
    (15, u'Other Public Sector'),
    (21, u'International NGO'),
    (22, u'National NGO'),
    (23, u'Regional NGO'),
    (30, u'Public Private Partnership'),
    (40, u'Multilateral'),
    (60, u'Foundation'),
    (70, u'Private Sector'),
    (80, u'Academic, Training and Research')
)

# From http://datadev.aidinfolabs.org/data/codelist/FinanceType.csv
# Fields: code, name, category, category-name, category-description

IATI_LIST_FINANCE_TYPE = (
    (110, u'Aid grant excluding debt reorganisation', 100, u'GRANT', u'Transfers in cash or in kind for which no legal debt is incurred by the recipient.'),
    (111, u'Subsidies to national private investors', 100, u'GRANT', u'Transfers in cash or in kind for which no legal debt is incurred by the recipient.'),
    (210, u'Interest subsidy grant in AF', 200, u'INTEREST SUBSIDY', u'Subsidies to soften the terms of private export credits, or loans or credits by the banking sector.'),
    (211, u'Interest subsidy to national private exporters', 200, u'INTEREST SUBSIDY', u'Subsidies to soften the terms of private export credits, or loans or credits by the banking sector.'),
    (310, u'Deposit basis', 300, u'CAPITAL SUBSCRIPTION', u'Payments to multilateral agencies in the form of notes and similar instruments, unconditionally cashable at sight by the recipient institutions.'),
    (311, u'Encashment basis', 300, u'CAPITAL SUBSCRIPTION', u'Payments to multilateral agencies in the form of notes and similar instruments, unconditionally cashable at sight by the recipient institutions.'),
    (410, u'Aid loan excluding debt reorganisation', 400, u'LOAN', u'Transfers in cash or in kind for which the recipient incurs legal debt.'),
    (411, u'Investment-related loan to developing countries', 400, u'LOAN', u'Transfers in cash or in kind for which the recipient incurs legal debt.'),
    (412, u'Loan in a joint venture with the recipient', 400, u'LOAN', u'Transfers in cash or in kind for which the recipient incurs legal debt.'),
    (413, u'Loan to national private investor', 400, u'LOAN', u'Transfers in cash or in kind for which the recipient incurs legal debt.'),
    (414, u'Loan to national private exporter', 400, u'LOAN', u'Transfers in cash or in kind for which the recipient incurs legal debt.'),
    (451, u'Non-banks guaranteed export credits', 450, u'EXPORT CREDIT', u'Official or private loans which are primarily export-facilitating in purpose. They are usually tied to a specific export from the extending country and not represented by a negotiable instrument.'),
    (452, u'Non-banks non-guaranteed portions of guaranteed export credits', 450, u'EXPORT CREDIT', u'Official or private loans which are primarily export-facilitating in purpose. They are usually tied to a specific export from the extending country and not represented by a negotiable instrument.'),
    (453, u'Bank export credits', 450, u'EXPORT CREDIT', u'Official or private loans which are primarily export-facilitating in purpose. They are usually tied to a specific export from the extending country and not represented by a negotiable instrument.'),
    (510, u'Acquisition of equity as part of a joint venture with the recipient', 500, u'EQUITY', u'Investment in a country on the DAC List of ODA Recipients that is not made to acquire a lasting interest in an enterprise.'),
    (511, u'Acquisition of equity not part of joint venture in developing countries', 500, u'EQUITY', u'Investment in a country on the DAC List of ODA Recipients that is not made to acquire a lasting interest in an enterprise.'),
    (512, u'Other acquisition of equity. Investment in a country on the DAC List of ODA Recipients that is not made to acquire a lasting interest in an enterprise.', 500, u'EQUITY', u'Investment in a country on the DAC List of ODA Recipients that is not made to acquire a lasting interest in an enterprise.'),
    (610, u'Debt forgiveness: ODA claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (611, u'Debt forgiveness: ODA claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (612, u'Debt forgiveness: OOF claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (613, u'Debt forgiveness: OOF claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (614, u'Debt forgiveness: Private claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (615, u'Debt forgiveness: Private claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (616, u'Debt forgiveness: OOF claims (DSR)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (617, u'Debt forgiveness: Private claims (DSR)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (618, u'Debt forgiveness: Other', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (620, u'Debt rescheduling: ODA claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (621, u'Debt rescheduling: ODA claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (622, u'Debt rescheduling: OOF claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (623, u'Debt rescheduling: OOF claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (624, u'Debt rescheduling: Private claims (P)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (625, u'Debt rescheduling: Private claims (I)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (626, u'Debt rescheduling: OOF claims (DSR)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (627, u'Debt rescheduling: Private claims (DSR)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (630, u'Debt rescheduling: OOF claim (DSR - original loan principal)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (631, u'Debt rescheduling: OOF claim (DSR - original loan interest)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (632, u'Debt rescheduling: Private claim (DSR - original loan principal)', 600, u'DEBT RELIEF', u'Debt cancellations, debt conversions, debt rescheduling within or outside the framework of the Paris Club.'),
    (710, u'Foreign direct investment', 700, u'INVESTMENT', u'Investment made by a private entity resident in a reporting country to acquire or add to a lasting interest(1) in an enterprise in a country on the DAC List of ODA Recipients.'),
    (711, u'Other foreign direct investment, including reinvested earnings', 700, u'INVESTMENT', u'Investment made by a private entity resident in a reporting country to acquire or add to a lasting interest(1) in an enterprise in a country on the DAC List of ODA Recipients.'),
    (810, u'Bank bonds', 800, u'BONDS', u'Acquisition of bonds issued by developing countries.'),
    (811, u'Non-bank bonds', 800, u'BONDS', u'Acquisition of bonds issued by developing countries.'),
    (910, u'Other bank securities/claims', 900, u'OTHER SECURITIES/CLAIMS', u''),
    (911, u'Other non-bank securities/claims', 900, u'OTHER SECURITIES/CLAIMS', u''),
    (912, u'Securities and other instruments issued by multilateral agencies', 900, u'OTHER SECURITIES/CLAIMS', u'')
)
