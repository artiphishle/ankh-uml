# UML Generator

Auto generation of UML diagrams, dependencies and relations are soon ready. Also sequence diagrams is a nice thing to verify process workflow during automated tests.

## Quickstart

There are two arguments allowed

- first will be te root file, which has to end with `.ts`, relative to the project root
- second will be the output directory, relative to the project root

Both arguments are optional, if not provided, the file of the example below is taken and the output will be `src/util/uml/`.

```bash
npm run uml -- "src/services/addition/reportAddition/autoManagedReportAddition.service.ts"
```

## Rendering

### PlantUML

Let's see an example of the PlantUML rendering.

#### Command

```bash
npm run uml -- "src/services/addition/reportAddition/autoManagedReportAddition.service.ts"
```

#### Image

![alt PlantUml Example](./example-1.png)

### Text

```text
@startuml
class AutoManagedReportAdditionService
{
  -logger
  +updateAutoManagedAdditionsForReport()
  +updateAutoManagedReportAdditionsForReport()
  -createAutoManagedAdditionsForReport()
  -createAutoManagedAdditionsForEventAndType()
  -getRelevantAutoManagedTypesForReport()
  -filterMatchingConditions()
  -loadReportWithEvents()
  -shouldCreateAutoManagedAdditionsForReport()
}
@enduml
```

### Mermaid

#### Text

Content to follow.

#### Image

Content to follow.
