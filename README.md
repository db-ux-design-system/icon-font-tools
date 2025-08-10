test# Icon font tools

If you have some svg icons and want to use them as a font you can generate and modify `woff2` files with these tools.

## API

To check the complete CLI API goto [API](./docs/API.md).

### Config

All properties can be passed via a config file. We use [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to fetch different config files:

```shell
By default, Cosmiconfig will check the current directory for the following:

- a package.json property
- a JSON or YAML, extensionless "rc file"
- an "rc file" with the extensions `.json`, `.yaml`, `.yml`, `.js`, `.ts`, `.mjs`, or `.cjs`
- any of the above two inside a `.config` subdirectory
```

## More information

- [Clean icons](./docs/CleanIcons.md)
- [Generate Icon Fonts](./docs/GenerateIconFonts.md)
- [Icon subset](./docs/IconSubset.md)
