# Icon subset

Remove unused icons from your icon font (`woff2`) to reduce file size.

> **Note:** Requires https://github.com/fonttools/fonttools to be installed. Most of the time you need it in production. In this case look at [CI/CD section](#cicd).

## Requirements - local

To subset icon fonts we use [fonttools](https://github.com/fonttools/fonttools). To use the tools you need python installed:

1. Install [python](https://docs.python-guide.org/starting/installation/#installation) and [ensure that you can run Python from the command line](https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-python-from-the-command-line)
2. Install fonttools: `pip3 install fonttools`
3. Install brotli: `pip3 install brotli`

## Use

### Config

Create a new file `icon-subset.json` with this content:

```json
{
  "src": "./my-path-to/icons",
  "safeList": ["airplane", "bell"]
}
```

### JS/TS

Here is an example for a JS file `index.(js|ts)`:

```js
// index.(js|ts)
import { iconSubset } from "@db-ux/icon-font-tools";

void iconSubset({
  src: "./my-path-to/icons",
  safeList: ["airplane", "bell"],
  ignore: {
    ignored: (p) => p.name.startsWith("NotoSans"),
  },
});
```

### CLI

Example:

```shell
npx @db-ux/icon-font-tools icon-subset --src ./my-path-to/icons --safeList airplane --safeList bell
```

For more information run:

```shell
npx @db-ux/icon-font-tools icon-subset --help
```

## CI/CD

In most cases you want some `build` job which produces some `dist` folder. We can optimize this `dist` folder before any e2e tests or deployment like this:

### GitHub Actions

The default GitHub image is already bundled with `nodejs` and `python`. You can use the following snippet to install the required tools:

```yaml
jobs:
  icon-subset:
    name: 🤓🔪 Icon subset
    runs-on: ubuntu-24.04 # Use Ubuntu 24.04 explicitly
    steps:
      - name: ⏬ Checkout repo
        uses: actions/checkout@v4

      - name: ⏬ Install fonttools
        run: |
          pip3 install fonttools brotli
          fonttools --help

      - name: 🏃🏃‍➡️ Run Icon subset
        run: npx @db-ux/icon-font-tools icon-subset
```

### GitLab CI

If you run on a public GitLab instance you might want to use the [Example job](#example-job):

#### Example job

```yaml
stages:
  - post_build

post_build:
  stage: post_build
  image: nikolaik/python-nodejs:latest
  before_script:
    - pip3 install fonttools brotli
    - fonttools --help
  script:
    - npx @db-ux/icon-font-tools icon-subset
  artifacts:
    paths:
      - dist # Your dist/build folder
```

#### Private instance

```yaml
stages:
  - post_build

post_build:
  stage: post_build
  image: nikolaik/python-nodejs:latest
  variables:
    PIP_INDEX_URL: https://my-private-registry.com/pip # Change this to your private registry e.g. JFrog Artifactory etc.
    PIP_DISABLE_PIP_VERSION_CHECK: true
  before_script:
    - export PATH="$PATH:/custom-runner/bin" # If you have a custom runner, you might need to change this as well to use fonttools
    - pip3 install fonttools brotli
    - fonttools --help
  script:
    - npx @db-ux/icon-font-tools icon-subset
  artifacts:
    paths:
      - dist # Your dist/build folder
```
