<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- Edited by XMLSpy® -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:akvo="http://akvo.org/api/v1/iati-activities">

  <xsl:template match="iati-activities">
      <xsl:apply-templates select="iati-activity" />
  </xsl:template>

  <xsl:template match="iati-activity">
    <object>
      <xsl:apply-templates select="title" />
      <xsl:apply-templates select="@default-currency" />
      <xsl:apply-templates select="@akvo:image-caption" />
      
      <xsl:apply-templates select="activity-status" />
      
      <xsl:apply-templates select="activity-date[@type='start-actual']" />
      <xsl:apply-templates select="activity-date[@type='end-actual']" />
      
      <xsl:apply-templates select="description[@type='1']" /><!-- General -->
      <xsl:apply-templates select="description[@type='2']"/><!-- Objectives -->
      <xsl:apply-templates select="description[@type='3' and @akvo:type='3']"/><!-- Traget groups -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='4']"/><!-- Subtitle -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='5']"/><!-- Summary -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='6']"/><!-- Background -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='7']" /><!-- Project plan -->
      <xsl:apply-templates select="description[@type='2' and @akvo:type='8']"/><!-- Goals overview -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='9']"/><!-- Current status -->
      <xsl:apply-templates select="description[@type='1' and @akvo:type='10']"/><!-- Sustainability -->

      <xsl:apply-templates select="document-link[@format='image/jpeg']" />
      
      <locations type="list">
        <xsl:apply-templates select="location" />
      </locations>

      <benchmarks type="list">
        <xsl:apply-templates select="result/indicator" />
      </benchmarks>
      
      <budget_items type="list">
        <xsl:apply-templates select="budget" />
      </budget_items>
      
      <goals type="list">
        <xsl:apply-templates select="result" />
      </goals>
      
      <partnerships type="list">
        <xsl:apply-templates select="participating-org" />
      </partnerships>
      
      <!-- 
      <business_unit>
        <xsl:value-of select="normalize-space(//iati-activity/@akvo:business-unit-id)"/>
      </business_unit>
       -->
      
    </object>
  </xsl:template>

  <!-- title -->
  <xsl:template match="title">
    <title>
      <xsl:value-of select="normalize-space(.)" />
    </title>
  </xsl:template>

  <!-- subtitle -->
  <xsl:template match="description[@type='1' and @akvo:type='4']">
    <subtitle>
      <xsl:value-of select="normalize-space(.)" />
    </subtitle>
  </xsl:template>
  
  <!-- status -->
  <xsl:template match="activity-status[@code='1']"><!-- Pipeline/identification -->
    <status>H</status><!-- Needs funding -->
  </xsl:template>
  
  <xsl:template match="activity-status[@code='2']"><!-- Implementation -->
    <status>A</status><!-- Active -->
  </xsl:template>
  
  <xsl:template match="activity-status[@code='3']"><!-- Completion -->
    <status>C</status><!-- Complete -->
  </xsl:template>
  
  <xsl:template match="activity-status[@code='4']"><!-- Post-completion -->
    <status>C</status><!-- Complete -->
  </xsl:template>
  
  <xsl:template match="activity-status[@code='5']"><!-- Cancelled -->
    <status>L</status><!-- Cancelled -->
  </xsl:template>
  
  <!-- categories ManyToManyField -->

  <!-- partners ManyToManyField -->

  <!-- project_plan_summary -->
  <xsl:template match="description[@type='1' and @akvo:type='5']">
    <project_plan_summary>
      <xsl:value-of select="." />
    </project_plan_summary>
  </xsl:template>
  
  <!-- current_image -->
  <!-- 
  <xsl:template match="document-link[@format='image/jpeg']">
    <current_image>
      <xsl:apply-templates select="@url"/>
    </current_image>
    <current_image_caption>
      <xsl:apply-templates select="akvo:caption"/>      
    </current_image_caption>
  </xsl:template>
   -->
  
  <xsl:template match="@akvo:image-caption">
    <current_image_caption>
      <xsl:value-of select="normalize-space(.)" />    
    </current_image_caption>
  </xsl:template>
  
  <xsl:template match="@url">
    <xsl:value-of select="normalize-space(.)" />    
  </xsl:template>
  
  
  <!-- current_image_caption -->

  <!-- goals_overview -->
  <xsl:template match="description[@type='2' and @akvo:type='8']">
    <goals_overview>
      <xsl:value-of select="." />
    </goals_overview>
  </xsl:template>
  
  <!-- current_status -->
  <xsl:template match="description[@type='1' and @akvo:type='9']">
    <current_status>
      <xsl:value-of select="." />
    </current_status>
  </xsl:template>
  
  <!-- project_plan -->
  <xsl:template match="description[@type='1' and @akvo:type='7']">
    <project_plan>
      <xsl:value-of select="." />
    </project_plan>
  </xsl:template>
  
  <!-- sustainability -->
  <xsl:template match="description[@type='1' and @akvo:type='10']">
    <sustainability>
      <xsl:value-of select="." />
    </sustainability>
  </xsl:template>
  
  <!-- background -->
  <xsl:template match="description[@type='1' and @akvo:type='6']">
    <background>
      <xsl:value-of select="." />
    </background>
  </xsl:template>
  
  <xsl:template match="description[@type='3' and @akvo:type='3']">
    <target_group>
      <xsl:value-of select="." />
    </target_group>
  </xsl:template>
  
  
  <!-- project_rating Currently not used-->

  <!-- notes Currently not used -->

  <!-- currency -->
  <xsl:template match="@default-currency">
    <currency>
      <xsl:value-of select="normalize-space(.)" />
    </currency>
  </xsl:template>

  <!-- date_request_posted -->
  <xsl:template match="activity-date[@type='start-actual']">
    <!-- two ways of expressing the date, either as data in the node or as the iso-date attribute -->
    <xsl:if test="not(.='')">
      <date_request_posted>
        <xsl:value-of select="normalize-space(.)" />
      </date_request_posted>
    </xsl:if>
    <xsl:if test=".=''">
      <date_request_posted>
        <xsl:value-of select="normalize-space(@iso-date)"/>
      </date_request_posted>
    </xsl:if>
  </xsl:template>

  <!-- date_complete -->
  <xsl:template match="activity-date[@type='end-actual']">
    <!-- two ways of expressing the date, either as data in the node or as the iso-date attribute -->
    <xsl:if test="not(.='')">
      <date_complete>
        <xsl:value-of select="normalize-space(.)" />
      </date_complete>
    </xsl:if>
    <xsl:if test=".=''">
      <date_complete>
        <xsl:value-of select="normalize-space(@iso-date)"/>
      </date_complete>
    </xsl:if>
  </xsl:template>

  <!-- primary_location ForeignKey -->
    <!-- set when locations are created -->
  
  <!-- budget Denormalized field-->

  <!-- funds Denormalized field-->

  <!-- funds_needed Denormalized field-->

  <!-- ************************** related resources ************************** -->
  
  <!-- location -->
  <xsl:template match="location">
    <xsl:choose>
      <xsl:when test="administrative[@country]">
        <object>
          <xsl:apply-templates select="coordinates" />
          <xsl:apply-templates select="administrative" />
          <xsl:apply-templates select="location-type" />
        </object>
      </xsl:when>
    </xsl:choose>      
  </xsl:template>

  <xsl:template match="coordinates">
    <xsl:apply-templates select="@latitude"/>
    <xsl:apply-templates select="@longitude"/>
  </xsl:template>
  
  <xsl:template match="@latitude">
    <latitude type="float">
      <xsl:value-of select="normalize-space(.)" />
    </latitude>
  </xsl:template>
  
  <xsl:template match="@longitude">
    <longitude type="float">
      <xsl:value-of select="normalize-space(.)" />
    </longitude>
  </xsl:template>

  <xsl:template match="administrative">
    <xsl:apply-templates select="@country"/>
  </xsl:template>
  
  <xsl:template match="@country">
    <country>
      <xsl:value-of select="normalize-space(.)" />
    </country>
  </xsl:template>

  <xsl:template match="location-type">
    <xsl:apply-templates select="@code"/>
  </xsl:template>
  
  <xsl:template match="@code">
    <xsl:if test=".='PPLC'">
      <city>
        <xsl:value-of select="normalize-space(../../name)" />
      </city>
    </xsl:if>
    <xsl:if test=".='PPL'">
      <city>
        <xsl:value-of select="normalize-space(../../name)" />
      </city>
    </xsl:if>
    <xsl:if test=".='PPLA'">
      <city>
        <xsl:value-of select="normalize-space(../../name)" />
      </city>
    </xsl:if>
    <xsl:if test=".='PPLA2'">
      <city>
        <xsl:value-of select="normalize-space(../../name)" />
      </city>
    </xsl:if>
    <xsl:if test=".='ADM1'">
      <state>
        <xsl:value-of select="normalize-space(../../name)" />
      </state>
    </xsl:if>
    <xsl:if test=".='ADM2'">
      <state>
        <xsl:value-of select="normalize-space(../../name)" />
      </state>
    </xsl:if>
  </xsl:template>
  
  <!-- goal -->
  <xsl:template match="result">
    <object>
      <text>
        <xsl:value-of select="normalize-space(title)" />
      </text>
    </object>
  </xsl:template>
  
  
  <!-- benchmark -->
  <xsl:template match="result/indicator">
    <object>
      <xsl:apply-templates select="title"/>
      <xsl:apply-templates select="period"/>
    </object>
  </xsl:template>
  
  <xsl:template match="indicator/title">
    <name>
      <xsl:value-of select="normalize-space(.)" />
    </name>
  </xsl:template>
  
  <xsl:template match="indicator/period">
    <xsl:choose>
      <xsl:when test="actual">
        <xsl:apply-templates select="actual"/>
      </xsl:when>
      <xsl:when test="target">
        <xsl:apply-templates select="target"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="actual">
    <value>
      <xsl:value-of select="normalize-space(@value)" />
    </value>
  </xsl:template>

  <xsl:template match="period/target">
    <value>
      <xsl:value-of select="normalize-space(@value)" />
    </value>
  </xsl:template>
  
  <!-- budget -->
  <!-- budget@type="2" is the actual budget and is what we use if it's available,
       otherwise we user budget@type="1". Since both types may exist we need the
       following construct.       
  -->
  <xsl:template match="iati-activity/budget[@type='1']">
    <xsl:choose>
      <!-- ignore Cordaid's budgets, they are handled by post-processing -->
      <xsl:when test="../budget[@akvo:budget-from]">
      </xsl:when>
      <!-- if there's a type="2" budget and it has value tags we use that instead, see below -->
      <xsl:when test="../budget[@type='2'] and ../budget[@type='2']/value">
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="value"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- if there's a type="2" we use that -->
  <xsl:template match="iati-activity/budget[@type='2']">
    <xsl:choose>
      <!-- ignore Cordaid's budgets, they are handled by post-processing -->
      <xsl:when test="../budget[@akvo:budget-from]">
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="value"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="value">
    <object>
      <amount>
        <xsl:value-of select="normalize-space(.)" />
      </amount>
      <label>
        <xsl:value-of select="normalize-space(@akvo:type)" />
      </label>
      <other_extra>
        <xsl:value-of select="normalize-space(@akvo:label)" />
      </other_extra>
    </object>
  </xsl:template>

  <!-- partnership -->
  <xsl:template match="participating-org" >
    <object>
      <!-- meta info needed to populate Partnership ad Organisation-->
      <reporting_org>
        <xsl:value-of select="normalize-space(//reporting-org/@ref)"/>
      </reporting_org>
      <business_unit>
        <xsl:value-of select="normalize-space(//iati-activity/@akvo:business-unit-id)"/>
      </business_unit>

      <!-- Organisation fields-->
      <name>
        <xsl:value-of select="normalize-space(.)"/>
      </name>
      <long_name>
        <xsl:value-of select="normalize-space(.)"/>
      </long_name>
      <organisation>
        <xsl:value-of select="normalize-space(@akvo:ref)"/>
      </organisation>
      <iati_org_id>
        <xsl:value-of select="normalize-space(@ref)"/>
      </iati_org_id>
      <new_organisation_type>
        <xsl:value-of select="normalize-space(@type)"/>
      </new_organisation_type>

      <!-- InternalOrganisationID fields-->
      <internal_org_id>
        <xsl:value-of select="normalize-space(@akvo:internal-org-ref)"/>
      </internal_org_id>

      <!-- Partnership fields-->
      <iati_activity_id>
        <xsl:value-of select="normalize-space(//iati-identifier)"/>
      </iati_activity_id>
      <internal_id>
        <xsl:value-of select="//iati-activity/@akvo:internal-project-id"/>
      </internal_id>
      <xsl:if test="@role='Accountable'">
        <partner_type>support</partner_type>
      </xsl:if>
      <xsl:if test="@role='Extending'">
        <partner_type>support</partner_type>
      </xsl:if>
      <xsl:if test="@role='Funding'">
        <partner_type>funding</partner_type>
      </xsl:if>
      <xsl:if test="@role='Implementing'">
        <partner_type>field</partner_type>
      </xsl:if>
    </object>
  </xsl:template>

  
</xsl:stylesheet>


