# BIEP evaluation dashboard: demonstration

A demonstration of the Bayesian Intervention Evaluation of Performance (BIEP) dashboard. It shows how far outcomes of an ongoing intervention are meeting their benchmarks, for all recipients, for segments of recipients, and for individuals.

**Open it:** https://robertjwest.github.io/Unlocking-Behaviour-Change/Bayesian-stats-tools/BIEP-dashboard-demo/

All the data are invented. The demonstration uses the outcome questions and intervention catalogue of a return-to-work pilot, with 350 dummy recipients. No real people are represented.

## Files

- `index.html`: the dashboard. It is a single file with the dummy data built in, and runs in any modern browser without installation.
- `BIEP_dummy_data.zip`: the five CSV files below in one download: https://robertjwest.github.io/Unlocking-Behaviour-Change/Bayesian-stats-tools/BIEP-dashboard-demo/BIEP_dummy_data.zip
- `dummy-data/`: the same dummy data as CSV files, laid out as in the input data specification (v4):
  - `recipients.csv`: one row per recipient
  - `exposure.csv`: one row per intervention spell
  - `outcomes.csv`: one row per recipient per assessment
  - `config.csv`: the configuration table, defining every variable, its target (`benchmark`), minimum acceptable level (`floor`), `tolerance` and missing-data rule, plus setting rows for the probability cut-offs
  - `schedule.csv`: the assessment schedule

## How outcomes are judged

Each outcome has a target and, optionally, a minimum acceptable level (floor) and a tolerance. The dashboard works out the probability that the true value is at or above each line (less the tolerance). An outcome is labelled **Meeting target**, **Above minimum**, **Not yet clear** or **Below minimum**. Individuals are flagged **Review** when their average probability of being at or above the minimum path is low, and **On track** only when their average probability of being on the target path is high. The cut-offs are set in the configuration table. Details are in the dashboard's *Method and options* tab.

## Using your own data

Open the **Data and checks** tab and choose the CSV files together. They are read in the browser only and are not uploaded anywhere. Alternatively, serve `index.html` from a web server with the files in a folder called `data` beside it, and the dashboard reads them on loading.
