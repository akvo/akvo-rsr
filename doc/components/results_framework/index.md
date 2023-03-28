# Results Framework

**[User documentation]**

The results framework allows users to collect results.
It is based upon the blog post: [How to build a results monitoring framework],
 which is recommended reading to understand the concepts and architecture described in this section.

The basic components of the results framework are:

 - [Result]s
 - [Indicator]s
 - [Period]s
 - [Indicator Period Data](indicator_period_data.md)

A [Result] has [Indicator]s, Indicators have [Period]s and those contain [data][Indicator Period Data],
 which is submitted by [Enumerator]s or staff.

## Example

- Result (outcome): The national government allocates more budget to WASH
  * Indicator (quantitative): Amount of budget that is allocated to the ministry of water on a yearly basis
    - Period: 2020-01-01 -- 2021-01-01
    - Period: 2021-01-01 -- 2022-01-01
    - Period: 2022-01-01 -- 2023-01-01
  * Indicator (qualitative): Perceived importance of WASH by citizens
    - Period: 2020-01-01 -- 2021-01-01
    - Period: 2021-01-01 -- 2022-01-01
    - Period: 2022-01-01 -- 2023-01-01

[How to build a results monitoring framework]: https://datajourney.akvo.org/blog/how-to-design-a-results-monitoring-framework
[Enumerator]: ../enumerator.md
[Indicator]: indicator.md
[Indicator Period Data]: indicator_period_data.md
[Period]: period.md
[Result]: result.md
[User documentation]: https://kb.akvo.org/rsr/results_framework/

