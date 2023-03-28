# Indicator

**Class**: [`akvo.rsr.models.result.Indicator`](#akvo.rsr.models.result.Indicator)

# Data types

There are two types of data on one can use when collecting data for indicators:

## Quantitative

The collect numeric data.

**Examples**

 - Total number of farmers subsidised
 - Number of new pupils in schools
 - Annual yield of corn in tonnes

Furthermore, these can be split into cumulative and differential reporting methods.

### Reporting methods

When data is entered into the system, it is counted in two ways.

#### Periodic

This is the default method of reporting where the counter is set to 0 at the beginning of the period,
 and the data submitted represents only what was done in that period

**Example**

_Indicator: Annual yield of corn in tonnes_

Every year, the corn fields are reaped and the amount collected is entered into the system.

 - "This year we reaped 10 tonnes of corn."
 - "Last year we collected 5 tonnes of corn."

#### Cumulative

Also known as "to date" reporting is like a tally that's never reset.
Each period represents the total at that time.

**Example**

_Indicator: Total number of farmers subsidised_

Every period more farmers are added to the total.
One doesn't have to sum up all the previous periods to get it.

 - "Since 2011, we have subsidized 500k farmers"
 - "To date, we have subsidized 500k farmers"

For the effects of cumulative reporting on [Aggregation](aggregation.md), 
 see the dedicated page on [Cumulative reporting](cumulative_reporting.md)
