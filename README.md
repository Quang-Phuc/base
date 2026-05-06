# Check List to follow

## Merge Request

### `Create merge request shuould follow the convention`

- Branch Name Convention: <type>/<jira-number>
- Commit Message Convention: <type>/<jira-number> | `description`
- Type includes: feature | hotfix | refactor | chore
- Title merge request for the feature process should follow: feature/<jira-number> | `description`
- Title merge request for the feature when in bugfix processing should follow: feature/<
  jira-number> | [<jira-number>, <jira-number>, ... ] | `description`
  //for example:

- For the feature implements JIRA task ASQLBC-19
  - Branch name: feature/ASQLBC-19
  - Commit message: feature/ASQLBC-19 | implement component A
- For fix bug of JIRA task ASQLBC-19
  - Branch name: feature/ASQLBC-19
  - Commit message: feature/ASQLBC-19 | [<jira-number>, <jira-number>]

### `What should be done before creating merge request`

- Run unit test for the whole application (if apply unit test)
- Check code coverage for the new code, make sure it coverages 100% (if apply unit test)
- Format the new code before commit
- run ng build to make sure there is no any issues or errors

### `What you shoud note when you push new commit`

- For the new commit to the current MR that unnecessary, using git commit-amend

## Coding

### `Using ChangeDetectionStrategy.OnPush if possible`

### `Using signal input/output or model instead of @Input/@Output`

### `Using es6 operator instead of for loop if possible`

### `the element in a class should follow the order`

- ViewChild/ContentChild
- input/output
- readonly variables
- public variables
- private variables
- getter
- constructor
- ngOninit/ngOnchange...ondestroy
- public function
- private function

### `file models only includes the same type`

- enum.ts: only declare enum
- const.ts only decalare constant
- model.ts only decalare interface,class,type

### `Naming file`

- using kebab case: user-management.component.ts

### `Spacing`

- every functions, block must be have gap equal a new line

### `Declare a undefined variable`

- Dont assign null or undefined value: shoudl do => dataView?: Dto;

### `For a defined variable dont assign type`

- should do: isLoading = false:
- dont do: isLoading: boolean = false;

### `every string value must be declare in enum/constant excludes controlName in formgroup`

### `Dont hard core in html file include style/css, data field`

### `use ngIf/else or @if/@else instead of isTrue ? 'A' : 'B'`

### `Remove console.log when finish debugging`

### `Dont assign any type for variable`

### `Must assign type for the param of a function`

// for example: filterName(name: string) {} or filerName(name = ''){}

### `Using common funtion for the duplicate logic`

### `Remove unuse code`

###

`When create a custom validator DONT use updateValueAndValidity() in formGroup` (if it will trigger changes in data form
all the time)

### `Naming pipe, directive, service is mapping with the its function, follow to the name of parent folder`

### `DONT import redundance just import what will be used`

### `Format code with the Prettier`

### `using nullish coalescing for null and undefined case`

// for example: valueA = valueB ?? '';

### `Using [class] when needed`

// for example:

- Dont use: <div [ngClass]="value ? 'primary' : '' "></div>
- Should use: <div [class.primary]="value"></div>

### `in component class remove if else when possible`

// for example:

- Dont: if(success){return A} else {return B}
- Should: return success ? A : B;

### `Apply ngTemplateOutlet to reslove the duplicate html content`

### `Dont use function to transform data in html file, use pipe instead`

### `change to private function if this function is not in html file`

### `Dont use property important in css, use selector instead`

### `Do not subscribe inside a subscription`

// for example:

- Dont: A.subscribe( () => {B.subscribe()}); or A.pipe(switchMap(() => {B.subscribe()})).subscrib();
- Should: A.pipe(switchMap() => B).subscribe(() => {})

### `Using readonly for the unchange variables`
