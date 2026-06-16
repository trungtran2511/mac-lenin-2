# Data Model: economy_data.json Schema

The entire state of the application's reference data is stored in `economy_data.json`. Below is the schema documentation.

## Root Schema
```json
{
  "job_offers": "JobOffer[]",
  "tech_scenarios": "TechScenario[]",
  "market_events": "MarketEvent[]",
  "ethical_dilemmas": "EthicalDilemma[]",
  "economic_sectors": "EconomicSector[]"
}
```

## Entity Details

### 1. JobOffer
Represents jobs in the Vietnamese market, showing how actual salaries compare to the reproduction cost of labor.
- `id` (string): Unique identifier.
- `title` (string): Name of the job.
- `salary` (number): Monthly wage in VND.
- `cost_of_living` (number): Minimum cost of living to reproduce labor power in VND.
- `hours_per_day` (number): Standard hours worked per day (usually 8).
- `necessary_hours` (number): Hours spent creating value equal to their wage.
- `surplus_hours` (number): Hours spent creating surplus value ($m$) for the employer.
- `description` (string): Humorously educational description.

### 2. TechScenario
Represents technological automation impact scenarios.
- `id` (string): Unique identifier.
- `title` (string): Tech name.
- `labor_reduction_pct` (number): Percentage reduction in necessary labor time.
- `description` (string): Marxist analysis of automation increasing relative surplus value.

### 3. MarketEvent
Represents real-life Vietnamese market events to demonstrate supply, demand, and original value.
- `id` (string): Unique identifier.
- `title` (string): Event name.
- `description` (string): Explanation of the event.
- `chart_data` (array): Data points for charting. Each item has:
  - `month` (string): Month name.
  - `original_value` (number): Intrinsic value index.
  - `market_price` (number): Actual market price index.

### 4. EthicalDilemma
Represents dilemmas a boss faces between maximizing profit ($m$) and social responsibility.
- `id` (string): Unique identifier.
- `scenario` (string): Description of the dilemma.
- `choices` (array): Options available. Each choice has:
  - `text` (string): Description of the choice.
  - `impact` (object):
    - `profit` (number): Change in profit status (-100 to +100).
    - `competitiveness` (number): Change in competitiveness (-100 to +100).
    - `social_responsibility` (number): Change in social responsibility (-100 to +100).
  - `explanation` (string): Marxist analysis of why this outcome occurs.

### 5. EconomicSector
Represents macroeconomic sectors in Vietnam's socialist-oriented market economy.
- `id` (string): Unique identifier.
- `name` (string): Sector name (e.g. State, Private, FDI).
- `gdp_contribution` (number): Percentage of GDP contribution.
- `constitutional_role` (string): Role defined in the Constitution of Vietnam.
- `description` (string): Detailed explanation.
