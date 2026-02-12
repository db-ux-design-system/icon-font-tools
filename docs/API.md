# API - @db-ux/icon-font-tools

CLI for generating or manipulating icon fonts from SVG files.

## clean-icons

Clean svgs for icon fonts to work

> You can use `clean-icons.json` as a config file. 
  By default it tries to search for the configuration otherwise use a correct path by passing `--config=./clean-icons.json`.

| long                | short | description                                                                                         | required | defaultValue |
| :------------------ | :---: | :-------------------------------------------------------------------------------------------------- | :------: | :----------- |
| `--src`             |  `-s` | Source folder with all svgs                                                                         |    `✅`   |              |
| `--traceResolution` |  `-r` | Change the default resolution of the trace                                                          |    `❌`   | `"600"`      |
| `--out`             |  `-o` | Relative path where the files should be written to. Empty string will overwrite the original files. |    `❌`   |              |
| `--dry`             |  `-d` | Do a dry run with this command - prints/returns output                                              |    `❌`   |              |
| `--ignore`          |  `-i` | Glob or path like to exclude from files                                                             |    `❌`   | `[]`         |
| `--debug`           |  `-g` | Extra logging                                                                                       |    `❌`   |              |
| `--config`          |  `-c` | Path to configuration file                                                                          |    `❌`   |              |

## generate-icon-fonts

Generate icon fonts from SVG files

> You can use `generate-icon-fonts.json` as a config file. 
  By default it tries to search for the configuration otherwise use a correct path by passing `--config=./generate-icon-fonts.json`.

| long                 | short | description                                                                           | required | defaultValue |
| :------------------- | :---: | :------------------------------------------------------------------------------------ | :------: | :----------- |
| `--fontName`         |  `-f` | The name of your font                                                                 |    `✅`   |              |
| `--src`              |  `-s` | Source folder with all svgs                                                           |    `✅`   |              |
| `--variants`         |  `-v` | Font variants e.g. solid, inverted, etc. We always add a "default" variant for icons. Space-separated: `--variants solid outline` |    `❌`   | `[]`         |
| `--withSizes`        |  `-w` | Splits the font into different sizes                                                  |    `❌`   |              |
| `--sizes`            |  `-z` | Custom sizes for font splitting (e.g., `--sizes 16 24 32`). Implicitly sets withSizes to true. When using custom sizes, the "all" folder is not generated in the output. |    `❌`   | `[]`         |
| `--prefix`           |  `-p` | Prefix of icons to delete for icons                                                   |    `❌`   |              |
| `--overwriteSources` |  `-o` | Overwrite all svgs inside src directory                                               |    `❌`   |              |
| `--dry`              |  `-d` | Do a dry run with this command - prints/returns output                                |    `❌`   |              |
| `--ignore`           |  `-i` | Glob or path like to exclude from files                                               |    `❌`   | `[]`         |
| `--debug`            |  `-g` | Extra logging                                                                         |    `❌`   |              |
| `--config`           |  `-c` | Path to configuration file                                                            |    `❌`   |              |

## icon-subset

Creates new icon font (woff2) by passing a safelist/blocklist with icon literals. Requires https://github.com/fonttools/fonttools to be installed.

> You can use `icon-subset.json` as a config file. 
  By default it tries to search for the configuration otherwise use a correct path by passing `--config=./icon-subset.json`.

| long          | short | description                                                                    | required | defaultValue |
| :------------ | :---: | :----------------------------------------------------------------------------- | :------: | :----------- |
| `--safeList`  |  `-l` | Includes only icons from provided list. Priority over 'blockList'.             |    `❌`   |              |
| `--blockList` |  `-b` | Excludes all icons from provided list. Can't be used together with 'safeList'. |    `❌`   |              |
| `--overwrite` |  `-w` | If the source file should be overwritten. Disables 'out' option.               |    `❌`   | `true`       |
| `--src`       |  `-s` | Source folder with all woff2 files                                             |    `❌`   |              |
| `--filePaths` |  `-f` | File paths to woff2 file which should be subsetted.                            |    `❌`   |              |
| `--out`       |  `-o` | Relative path where the file should be written                                 |    `❌`   | `"."`        |
| `--dry`       |  `-d` | Do a dry run with this command - prints/returns output                         |    `❌`   |              |
| `--debug`     |  `-g` | Extra logging                                                                  |    `❌`   |              |
| `--config`    |  `-c` | Path to configuration file                                                     |    `❌`   |              |
| `--ignore`    |  `-i` | Glob or path like to exclude from files                                        |    `❌`   | `[]`         |

