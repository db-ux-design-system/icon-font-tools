# Clean icons

For icon font generation each icon should be a single path. To clean up your icons run:

```shell
npx @db-ux/icon-font-tools clean-icons --src ./my-path-to/icons --ignore **/test.svg
```

We use [svg-fixer](https://github.com/oslllo/svg-fixer) to clean up the icons. This will slightly increase the file size but ensures that the icons are displayed correctly.