# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

IATI_V1_STRING = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="1.05">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1">
        <iati-identifier>NL-KVK-0987654321-v1</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">Test Organisation Import</reporting-org>
        <other-identifier owner-name="Agency A" owner-ref="AA-AAA-123456789">ABC123-XYZ</other-identifier>
        <title>Test project for IATI import v1</title>
        <description type="1">General activity description text.  Long description of the activity with no particular structure.</description>
        <description type="2">Objectives for the activity, for example from a logical framework.</description>
        <description type="3">Statement of groups targeted to benefit from the activity.</description>
        <activity-status code="2" />
        <activity-date iso-date="2012-04-15" type="start-planned" />
        <activity-date iso-date="2012-04-28" type="start-actual" />
        <activity-date iso-date="2015-12-31" type="end-planned" />
        <activity-date iso-date="2015-12-31" type="end-actual" />
        <contact-info type="1">
           <organisation>Agency A</organisation>
           <person-name>A. Example</person-name>
           <job-title>Transparency Lead</job-title>
           <telephone>0044111222333444</telephone>
           <email>transparency@example.org</email>
           <mailing-address>Transparency House, The Street, Town, City, Postcode</mailing-address>
           <website>http://www.example.org</website>
        </contact-info>
        <participating-org ref="BB-BBB-123456789" role="Funding" type="40">Agency B</participating-org>
        <participating-org ref="CC-CCC-123456789" role="Extending" type="10">Agency C</participating-org>
        <participating-org ref="AA-AAA-123456789" role="Implementing" type="21">Agency A</participating-org>
        <activity-scope code="3" />
        <recipient-country code="AF" />
        <recipient-region code="498" vocabulary="1" />
        <location ref="AF-KAN">
           <location-id vocabulary="G1" code="1453782" />
           <name>Location name</name>
           <description>Location description</description>
           <activity-description>A description that qualifies the activity taking place at the location</activity-description>
           <administrative level="1" code="1453782" vocabulary="G1" />
           <point srsName="http://www.opengis.net/def/crs/EPSG/0/4326">
            <pos>31.616944 65.716944</pos>
           </point>
           <exactness code="1"/>
           <location-reach code="1" />
           <location-class code="2"/>
           <feature-designation code="PRNQ"/>
        </location>
        <sector code="111" vocabulary="DAC" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1">
                <description>Description text</description>
            </budget-item>
        </country-budget-items>
        <policy-marker code="2" significance="3" vocabulary="DAC" />
        <collaboration-type code="1" />
        <default-finance-type code="110" />
        <default-flow-type code="10" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1">
           <period-start iso-date="2014-01-01" />
           <period-end iso-date="2014-12-31" />
           <value currency="EUR" value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement updated="2014-01-01">
           <period-start iso-date="2014-01-01" />
           <period-end iso-date="2014-12-31" />
           <value currency="EUR" value-date="2014-01-01">3000</value>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234">
           <value currency="EUR" value-date="2012-01-01">1000</value>
           <description>Transaction description text</description>
           <transaction-type code="IF" />
           <provider-org provider-activity-id="BB-BBB-123456789-1234AA" ref="BB-BBB-123456789">Agency B</provider-org>
           <receiver-org receiver-activity-id="AA-AAA-123456789-1234" ref="AA-AAA-123456789">Agency A</receiver-org>
           <transaction-date iso-date="2012-01-01" />
           <disbursement-channel code="1" />
        </transaction>
        <transaction ref="1234">
           <value currency="EUR" value-date="2012-01-01">1000</value>
           <description>Transaction description text</description>
           <transaction-type code="IF" />
           <provider-org provider-activity-id="BB-BBB-123456789-1234AA" ref="BB-BBB-123456789">Agency B</provider-org>
           <receiver-org receiver-activity-id="AA-AAA-123456789-1234" ref="AA-AAA-123456789">Agency A</receiver-org>
           <transaction-date iso-date="2012-01-01" />
           <flow-type code="20" />
           <finance-type code="111" />
           <aid-type code="A02" />
           <tied-status code="5" />
           <disbursement-channel code="1" />
        </transaction>
        <document-link format="application/vnd.oasis.opendocument.text" url="http://www.example.org/docs/report_en.odt">
           <title>Project report 2013</title>
           <category code="A01" />
           <language code="en" />
        </document-link>
        <activity-website>http://www.example.com/en/activity/ABC123</activity-website>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <conditions attached="1">
            <condition type="1">Conditions text</condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>Result 1 title</title>
            <description>Result 1 description text</description>
            <indicator measure="1" ascending="1">
                <title>Indicator 1 title</title>
                <description>Indicator 1 description text</description>
                <baseline year="2012" value="10">
                    <comment>Baseline comment text</comment>
                </baseline>
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                    <target value="10">
                        <comment>Target comment text</comment>
                    </target>
                    <actual value="11">
                        <comment>Actual comment text</comment>
                    </actual>
                </period>
           </indicator>
        </result>
        <fss extraction-date="2014-05-06" priority="1" phaseout-year="2016">
            <forecast year="2014" value-date="2013-07-03" currency="GBP">10000</forecast>
        </fss>
        <crs-add>
            <aidtype-flag code="1" significance="1" />
            <loan-terms rate-1="4" rate-2="3">
                <repayment-type code="1" />
                <repayment-plan code="4" />
                <commitment-date iso-date="2013-09-01"/>
                <repayment-first-date iso-date="2014-01-01" />
                <repayment-final-date iso-date="2020-12-31" />
            </loan-terms>
            <loan-status year="2014" currency="GBP" value-date="2013-05-24">
                <interest-received>200000</interest-received>
                <principal-outstanding>1500000</principal-outstanding>
                <principal-arrears>0</principal-arrears>
                <interest-arrears>0</interest-arrears>
            </loan-status>
        </crs-add>
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
    </iati-activity>
</iati-activities>
"""

IATI_V2_STRING = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="2.02">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1">
        <iati-identifier>NL-KVK-0987654321-v2</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import v2</narrative>
        </title>
    </iati-activity>
</iati-activities>
"""
