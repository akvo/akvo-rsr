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
           <administrative level="a" code="1453782" vocabulary="G1" />
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
                <baseline value="10">
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
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1" humanitarian="1">
        <iati-identifier>NL-KVK-0987654321-v2</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import v2</narrative>
        </title>
        <description type="1">
           <narrative>General activity description text.  Long description of the activity with no particular structure.</narrative>
        </description>
        <description type="2">
           <narrative>Objectives for the activity, for example from a logical framework.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <participating-org ref="BB-BBB-123456789" role="1" type="40" activity-id="BB-BBB-123456789-1234">
           <narrative>Name of Agency B</narrative>
        </participating-org>
        <participating-org ref="CC-CCC-123456789" role="2" type="10" activity-id="CC-CCC-123456789-1234">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <participating-org ref="AA-AAA-123456789" role="3" type="21" activity-id="AA-AAA-123456789-1234">
           <narrative>Name of Agency A</narrative>
        </participating-org>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <activity-status code="2" />
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="2012-04-28" type="2" />
        <activity-date iso-date="2015-12-31" type="3" />
        <activity-date iso-date="2015-12-31" type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="AF-KAN">
            <location-reach code="1" />
            <location-id vocabulary="G1" code="1453782" />
            <name>
                <narrative>Location name</narrative>
            </name>
            <description>
                <narrative>Location description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at the location.</narrative>
            </activity-description>
            <administrative vocabulary="G1" level="1" code="1453782" />
            <point srsName="http://www.opengis.net/def/crs/EPSG/0/4326">
                <pos>31.616944 65.716944</pos>
            </point>
            <exactness code="1"/>
            <location-class code="2"/>
            <feature-designation code="ADMF"/>
        </location>
        <location ref="KH-PNH">
            <location-reach code="1" />
            <location-id vocabulary="G1" code="1821306" />
            <name>
                <narrative>Location #2 name</narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative vocabulary="G1" level="1" code="1453782" />
            <coordinates latitude="31.616944" longitude="65.716944" />
            <exactness code="1"/>
            <location-class code="2"/>
            <feature-designation code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="98" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" status="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <transaction-date iso-date="2012-01-01" />
            <value currency="EUR" value-date="2012-01-01">1000</value>
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link format="application/vnd.oasis.opendocument.text" url="http:www.example.org/docs/report_en.odt">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="1">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <baseline year="2012" value="10">
                    <comment>
                        <narrative>Baseline comment text</narrative>
                    </comment>
                </baseline>
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                    <target value="10">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Target comment text</narrative>
                        </comment>
                    </target>
                    <actual value="11">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Actual comment text</narrative>
                        </comment>
                    </actual>
                </period>
           </indicator>
        </result>
        <crs-add>
            <other-flags code="1" significance="1" />
            <loan-terms rate-1="4" rate-2="3">
                <repayment-type />
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
           <channel-code>21039</channel-code>
        </crs-add>
        <fss extraction-date="2014-05-06" priority="1" phaseout-year="2016">
            <forecast year="2014" value-date="2013-07-03" currency="GBP">10000</forecast>
        </fss>
    </iati-activity>
</iati-activities>
"""

IATI_V2_STRING_INCORRECT = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="2.02" xmlns:akvo="http://akvo.org/iati-activities">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="a">
        <iati-identifier>NL-KVK-0987654321-incorrect</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import (incorrect)</narrative>
        </title>
        <description type="1">
           <narrative>General activity description text.  Long description of the activity with no particular structure.</narrative>
        </description>
        <description type="2">
           <narrative>Objectives for the activity, for example from a logical framework.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="2012-04-28" type="2" />
        <activity-date iso-date="31-12-2015" type="3" />
        <activity-date type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="KH-PNH">
            <location-reach code="1" />
            <name>
                <narrative>Location #2 name</narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative code="1234" country="XX" />
            <exactness code="1"/>
            <location-class code="2"/>
            <location-type code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="98" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" status="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <transaction-date iso-date="2012-01-01" />
            <value currency="EUR" value-date="2012-01-01">1000</value>
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link format="application/vnd.oasis.opendocument.text" url="http:www.example.org/docs/report_en.odt">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="1">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <baseline year="2012" value="10">
                    <comment>
                        <narrative>Baseline comment text</narrative>
                    </comment>
                </baseline>
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                    <target value="10">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Target comment text</narrative>
                        </comment>
                    </target>
                    <actual value="11">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Actual comment text</narrative>
                        </comment>
                    </actual>
                </period>
           </indicator>
        </result>
        <crs-add>
            <other-flags code="1" significance="1" />
            <channel-code>21039</channel-code>
        </crs-add>
        <fss extraction-date="2014-05-06" priority="1" phaseout-year="2016">
            <forecast year="2014" value-date="2013-07-03" currency="GBP">10000</forecast>
        </fss>
    </iati-activity>
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="a">
        <iati-identifier>NL-KVK-0987654321-incorrect</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import (incorrect)</narrative>
        </title>
        <description type="1">
           <narrative>General activity description text.  Long description of the activity with no particular structure.</narrative>
        </description>
        <description type="2">
           <narrative>Objectives for the activity, for example from a logical framework.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <description akvo:type="99" akvo:label="Custom field 2" akvo:section="15" akvo:max-characters="500" akvo:help-text="Help"
                akvo:mandatory="true" akvo:order="1">
           <narrative>Objectives 2 for the activity, for example from a logical framework.</narrative>
        </description>
        <description akvo:type="99" akvo:label="Custom field 3" akvo:section="a" akvo:max-characters="a" akvo:help-text="Help"
                akvo:mandatory="true" akvo:order="a">
           <narrative>Objectives 3 for the activity, for example from a logical framework.</narrative>
        </description>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <participating-org ref="CC-CCC-123456789" role="a" type="10" activity-id="CC-CCC-123456789-1234" akvo:funding-amount="1.23">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <participating-org type="10" />
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="2012-04-28" type="2" />
        <activity-date iso-date="2015-12-31" type="3" />
        <activity-date iso-date="2015-12-31" type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="KH-PNH">
            <location-reach code="1" />
            <name>
                <narrative>Location #2 name</narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative code="1234" country="XX" />
            <exactness code="1"/>
            <location-class code="2"/>
            <location-type code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="98" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" status="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value currency="EUR" value-date="2014-01-01">3000</value>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <transaction-date iso-date="2012-01-01" />
            <value currency="EUR" value-date="2012-01-01">1000</value>
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link format="application/vnd.oasis.opendocument.text" url="http:www.example.org/docs/report_en.odt">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="1">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <baseline year="2012" value="10">
                    <comment>
                        <narrative>Baseline comment text</narrative>
                    </comment>
                </baseline>
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                    <target value="10">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Target comment text</narrative>
                        </comment>
                    </target>
                    <actual value="11">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Actual comment text</narrative>
                        </comment>
                    </actual>
                </period>
           </indicator>
        </result>
        <crs-add />
        <fss extraction-date="2014-05-06" priority="1" phaseout-year="2016">
            <forecast year="2014" value-date="2013-07-03" currency="GBP" />
        </fss>
    </iati-activity>
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="a">
        <iati-identifier>NL-KVK-0987654321-incorrect</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI import (incorrect)</narrative>
        </title>
        <description type="1">
           <narrative>General activity description text.  Long description of the activity with no particular structure.</narrative>
        </description>
        <description akvo:type="99" akvo:label="Custom field" akvo:section="1" akvo:max-characters="500" akvo:help-text="Help"
                akvo:mandatory="true" akvo:order="1">
           <narrative>Objectives 1 for the activity, for example from a logical framework.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <participating-org ref="CC-CCC-123456789" role="1" type="10" activity-id="CC-CCC-123456789-1234">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="2012-04-28" type="2" />
        <activity-date iso-date="2015-12-31" type="3" />
        <activity-date iso-date="2015-12-31" type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="KH-PNH">
            <location-reach code="1" />
            <name>
                <narrative>Location #2 name</narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative code="1234" country="XX" />
            <exactness code="1"/>
            <location-class code="2"/>
            <location-type code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="98" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" status="1" akvo:type="a" akvo:label="This is a very very very very long label">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value value-date="2014-01-01">3000</value>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value value-date="2014-01-01">3000</value>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <transaction-date iso-date="2012-01-01" />
            <value currency="EUR" value-date="2012-01-01">1000</value>
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link url="http://akvo.org/wp-content/themes/Akvo-responsive/images/akvoLogoTop.png" akvo:photo-credit="Me">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="1">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <baseline year="year" value="10">
                    <comment>
                        <narrative>Baseline comment text</narrative>
                    </comment>
                </baseline>
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                    <target value="10">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Target comment text</narrative>
                        </comment>
                    </target>
                    <actual value="11">
                        <location ref="AF-KAN" />
                        <location ref="KH-PNH" />
                        <dimension name="sex" value="female" />
                        <dimension name="age" value="adult" />
                        <comment>
                            <narrative>Actual comment text</narrative>
                        </comment>
                    </actual>
                </period>
           </indicator>
        </result>
    </iati-activity>
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="a">
        <iati-identifier>NL-KVK-0987654321-incorrect</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <description type="1">
            <narrative>
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
                General activity description text. Long description of the activity with no particular structure.
            </narrative>
        </description>
        <description akvo:type="99" akvo:label="New one" akvo:section="2" akvo:max-characters="150" akvo:help-text="Help"
                akvo:mandatory="true">
           <narrative>Bla bla bla.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="2012-04-28" type="2" />
        <activity-date iso-date="2015-12-31" type="3" />
        <activity-date iso-date="2015-12-31" type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="KH-PNH">
            <location-reach code="1" />
            <name>
                <narrative>
                    This name is way too long to fit in the name field. Therefore it should be cut
                    off and then it will fit in the name field.
                </narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative code="1234" country="XX" />
            <exactness code="1"/>
            <location-class code="2"/>
            <location-type code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="98" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" akvo:type="1" status="1" akvo:label="Other">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <transaction-date iso-date="2012-01-01" />
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link url="http://akvo.org/wp-content/themes/Akvo-responsive/images/ThisImageDoesNotExist.png" akvo:photo-credit="Me">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <activity-website>http://rsr.akvo.org/en/</activity-website>
        <document-link format="application/http" url="http://rsr.akvo.org/en/" />
        <document-link format="application/http" url="http://www.google.nl/">
            <title>
                <narrative>Search engine</narrative>
            </title>
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="false">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                </period>
           </indicator>
        </result>
    </iati-activity>
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="a">
        <iati-identifier>NL-KVK-0987654321-incorrect</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <description type="1">
            <narrative>General activity description text. Long description of the activity with no particular structure.</narrative>
        </description>
        <description akvo:type="99" akvo:label="New one" akvo:section="2" akvo:max-characters="150" akvo:help-text="Help"
                akvo:mandatory="true">
           <narrative>Bla bla bla.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <other-identifier ref="ABC123-XYZ" type="A1">
            <owner-org ref="AA-AAA-123456789">
                <narrative>Organisation name</narrative>
            </owner-org>
        </other-identifier>
        <activity-date iso-date="2012-04-15" type="1" />
        <activity-date iso-date="28-04-2012" type="2" />
        <activity-date iso-date="2015-12-31" type="3" />
        <activity-date type="4" />
        <contact-info type="1">
            <organisation>
                <narrative>Agency A</narrative>
            </organisation>
            <department>
                <narrative>Department B</narrative>
            </department>
            <person-name>
                <narrative>A. Example</narrative>
            </person-name>
            <job-title>
                <narrative>Transparency Lead</narrative>
            </job-title>
            <telephone>0044111222333444</telephone>
            <email>transparency@example.org</email>
            <website>http://www.example.org</website>
            <mailing-address>
                <narrative>Transparency House, The Street, Town, City, Postcode</narrative>
            </mailing-address>
        </contact-info>
        <activity-scope code="3" />
        <recipient-country code="AF" percentage="25" />
        <recipient-country code="AG" percentage="25" />
        <recipient-region code="489" vocabulary="1" percentage="25" />
        <recipient-region code="289" vocabulary="1" percentage="25" />
        <recipient-region code="A1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" percentage="100" />
        <location ref="KH-PNH">
            <location-reach code="1" />
            <name>
                <narrative>
                    This name is way too long to fit in the name field. Therefore it should be cut
                    off and then it will fit in the name field.
                </narrative>
            </name>
            <description>
                <narrative>Location #2 description</narrative>
            </description>
            <activity-description>
                <narrative>A description that qualifies the activity taking place at location #2</narrative>
            </activity-description>
            <administrative code="1234" country="XX" />
            <exactness code="1"/>
            <location-class code="2"/>
            <location-type code="ADMF"/>
        </location>
        <sector vocabulary="2" code="111" percentage="50" />
        <sector vocabulary="2" code="112" percentage="50" />
        <sector vocabulary="999999" vocabulary-uri="http://example.com/vocab.html" code="A1" percentage="100" />
        <country-budget-items vocabulary="2">
            <budget-item code="1.1.1" percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
            <budget-item code="1.2.1"  percentage="50">
                <description>
                    <narrative>Description text</narrative>
                </description>
            </budget-item>
        </country-budget-items>
        <humanitarian-scope type="1" vocabulary="1-2" code="2015-000050" />
        <humanitarian-scope type="1" vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1">
            <narrative xml:lang="en">Syrian refugee crisis, Middle-east &amp; Europe (2011 onwards)</narrative>
        </humanitarian-scope>
        <policy-marker vocabulary="1" code="2" significance="3" />
        <policy-marker vocabulary="1" code="9" significance="4" />
        <policy-marker vocabulary="99" vocabulary-uri="http://example.com/vocab.html" code="A1" significance="3" />
        <collaboration-type code="1" />
        <default-flow-type code="10" />
        <default-finance-type code="110" />
        <default-aid-type code="A01" />
        <default-tied-status code="3" />
        <budget type="1" akvo:type="1" status="1" akvo:label="Other">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <value value-date="2014-01-01">3000</value>
        </budget>
        <planned-disbursement type="1">
            <period-start iso-date="2014-01-01" />
            <period-end iso-date="2014-12-31" />
            <provider-org provider-activity-id="BB-BBB-123456789-1234AA" type="10" ref="BB-BBB-123456789">
                <narrative>Agency B</narrative>
            </provider-org>
            <receiver-org receiver-activity-id="AA-AAA-123456789-1234" type="23" ref="AA-AAA-123456789">
                <narrative>Agency A</narrative>
            </receiver-org>
        </planned-disbursement>
        <capital-spend percentage="88.8" />
        <transaction ref="1234" humanitarian="1">
            <transaction-type code="1" />
            <description>
                <narrative>Transaction description text</narrative>
            </description>
            <disbursement-channel code="1" />
            <sector vocabulary="2" code="111" />
            <recipient-country code="TM" />
            <recipient-region code="616" vocabulary="1" />
            <flow-type code="10" />
            <finance-type code="110" />
            <aid-type code="A01" />
            <tied-status code="3" />
        </transaction>
        <document-link url="http://akvo.org/wp-content/themes/Akvo-responsive/images/ThisImageDoesNotExist.png" akvo:photo-credit="Me">
            <title>
                <narrative>Project Report 2013</narrative>
            </title>
            <category code="A01" />
            <language code="en" />
            <document-date iso-date="2014-02-05" />
        </document-link>
        <activity-website>http://rsr.akvo.org/en/</activity-website>
        <document-link format="application/http" url="http://rsr.akvo.org/en/" />
        <document-link format="application/http" url="http://www.google.nl/">
            <title>
                <narrative>Search engine</narrative>
            </title>
        </document-link>
        <related-activity ref="AA-AAA-123456789-6789" type="1" />
        <legacy-data name="Project Status" value="7" iati-equivalent="activity-status" />
        <legacy-data name="cost" value="1000" iati-equivalent="transaction" />
        <conditions attached="1">
            <condition type="1">
                <narrative>Conditions text</narrative>
            </condition>
        </conditions>
        <result type="1" aggregation-status="1">
            <title>
                <narrative>Result title</narrative>
            </title>
            <description>
                <narrative>Result description text</narrative>
            </description>
            <indicator measure="1" ascending="unknown">
                <title>
                    <narrative>Indicator title</narrative>
                </title>
                <description>
                    <narrative>Indicator description text</narrative>
                </description>
                <reference vocabulary="1" code="3429" />
                <reference vocabulary="7" code="861" />
                <reference vocabulary="99" code="B1" indicator-uri="http://example.com/indicators.html" />
                <period>
                    <period-start iso-date="2013-01-01" />
                    <period-end iso-date="2013-03-31" />
                </period>
           </indicator>
        </result>
    </iati-activity>
</iati-activities>
"""

IATI_ICCO_STRING = """
<iati-activities generated-datetime="2014-09-10T07:15:37Z" version="2.02">
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1" humanitarian="1">
        <iati-identifier>NL-KVK-0987654321-icco</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI ICCO import</narrative>
        </title>
        <description>
            <narrative>Subtitle: Test subtitle</narrative>
        </description>
        <description>
            <narrative>Project summary: Test subtitle</narrative>
        </description>
        <description>
            <narrative>Background: Test subtitle</narrative>
        </description>
        <description>
            <narrative>Baseline situation: Test subtitle</narrative>
        </description>
        <description>
            <narrative>Project plan: Test subtitle</narrative>
        </description>
        <description>
            <narrative>Sustainability: Test subtitle</narrative>
        </description>
        <participating-org ref="BB-BBB-123456789" role="1" type="40" activity-id="BB-BBB-123456789-1234">
           <narrative>Name of Agency B</narrative>
        </participating-org>
        <participating-org ref="CC-CCC-123456789" role="2" type="10" activity-id="CC-CCC-123456789-1234">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <participating-org ref="AA-AAA-123456789" role="3" type="21" activity-id="AA-AAA-123456789-1234">
           <narrative>Name of Agency A</narrative>
        </participating-org>
    </iati-activity>
    <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1" humanitarian="1">
        <iati-identifier>NL-KVK-0987654321-icco</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI ICCO import</narrative>
        </title>
        <description>
            <narrative>Project name: Test subtitle</narrative>
        </description>
        <description>
            <narrative>
                Project summary:
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
                This text is way too long to fit in the project summary field. It will not fit and will therefore not be stored in the summary.
            </narrative>
        </description>
        <participating-org ref="BB-BBB-123456789" role="1" type="40" activity-id="BB-BBB-123456789-1234">
           <narrative>Name of Agency B</narrative>
        </participating-org>
        <participating-org ref="CC-CCC-123456789" role="2" type="10" activity-id="CC-CCC-123456789-1234">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <participating-org ref="AA-AAA-123456789" role="3" type="21" activity-id="AA-AAA-123456789-1234">
           <narrative>Name of Agency A</narrative>
        </participating-org>
    </iati-activity>
        <iati-activity xml:lang="en" default-currency="USD" last-updated-datetime="2014-09-10T07:15:37Z" hierarchy="1" humanitarian="1">
        <iati-identifier>NL-KVK-0987654321-icco</iati-identifier>
        <reporting-org ref="NL-KVK-0987654321" type="22" secondary-reporter="0">
            <narrative>Test Organisation Import</narrative>
        </reporting-org>
        <title>
            <narrative>Test project for IATI ICCO import</narrative>
        </title>
        <description type="1">
           <narrative>General activity description text.  Long description of the activity with no particular structure.</narrative>
        </description>
        <description type="2">
           <narrative>Objectives for the activity, for example from a logical framework.</narrative>
        </description>
        <description type="3">
           <narrative>Statement of groups targeted to benefit from the activity.</narrative>
        </description>
        <participating-org ref="BB-BBB-123456789" role="1" type="40" activity-id="BB-BBB-123456789-1234">
           <narrative>Name of Agency B</narrative>
        </participating-org>
        <participating-org ref="CC-CCC-123456789" role="2" type="10" activity-id="CC-CCC-123456789-1234">
           <narrative>Name of Agency C</narrative>
        </participating-org>
        <participating-org ref="AA-AAA-123456789" role="3" type="21" activity-id="AA-AAA-123456789-1234">
           <narrative>Name of Agency A</narrative>
        </participating-org>
    </iati-activity>
</iati-activities>
"""
