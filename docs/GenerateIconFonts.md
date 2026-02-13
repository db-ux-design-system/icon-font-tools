# Generate icon fonts

We search for all `**/*.svg` files inside the `src` directory and create a new icon font with the provided name. You can preview all generated icons here: `./my-path-to/icons/fonts/all/index.html`.

> **_NOTE:_** We use four different sizes for components (16, 20, 24, 32) to show more or less details. You can do the same by providing another file with a size suffix for example "icon_file_name_16.svg".

## Output Folder Structure

### Default (without size splitting)
Generates an `all` folder and a `default` and `filled` folders with all icons:
- `./fonts/all/` - Contains all icons combined
- `./fonts/default/` - Default variant
- `./fonts/default/` - Default variant
- `./fonts/default_*/` - Further default variant sized fonts
- `./fonts/filled/` - Filled variant
- `./fonts/filled_*/` - Further filled variant sized fonts

### With size splitting (`--withSizes` or `--sizes`)
When using `--withSizes` with default sizes [12, 14, 16, 20, 24, 28, 32, 48, 64]:
- `./fonts/all/` - Contains all icons combined
- `./fonts/default/` - Default variant without size suffix
- `./fonts/default_12/`, `./fonts/default_16/`, etc. - Size-specific variants

When using custom `--sizes` (e.g., `--sizes 16 24 32`):
- **No `all` folder is generated** - only the specific sizes you requested
- `./fonts/default/` - Default variant without size suffix  
- `./fonts/default_16/`, `./fonts/default_24/`, `./fonts/default_32/` - Only your requested sizes

This optimization reduces build time and output size when you know exactly which sizes you need.

## JS/TS

Here is an example for a JS file `index.js`:

```js
// index.js
import { generateIconFonts } from "@db-ux/icon-font-tools";

// With default sizes
void generateIconFonts({
  fontName,
  src: "./icons",
  ignore: ["**/node_modules/**"],
  variants: ["filled"],
  withSizes: true,
});

// Or with custom sizes (no "all" folder generated)
void generateIconFonts({
  fontName,
  src: "./icons",
  ignore: ["**/node_modules/**"],
  variants: ["filled"],
  sizes: [16, 24, 32], // Only generates these specific sizes
});
```

## CLI

Example:

```shell
# Basic usage
npx @db-ux/icon-font-tools generate-icon-fonts --src ./my-path-to/icons --fontName my-name

# With custom sizes (no "all" folder generated)
npx @db-ux/icon-font-tools generate-icon-fonts --src ./my-path-to/icons --fontName my-name --sizes 16 24 32

# With all default sizes
npx @db-ux/icon-font-tools generate-icon-fonts --src ./my-path-to/icons --fontName my-name --withSizes
```

For more information run:

```shell
npx @db-ux/icon-font-tools --help
```

## How to use

In your app you need to include some of the generated files:

```html
./my-path-to/icons/fonts/my-name.woff2 ./my-path-to/icons/fonts/font-face.css
```

> **_NOTE:_** In case you put the files in a separate folder of your `public` directory be aware to adopt the path in your generated `font-face.css` file: `url("/{YOUR_FOLDER}}/my-name.woff2?t=1698750286189") format("woff2");`

> **_NOTE:_** The source files need to provide the following attributes: width, height and viewbox to generate the icon font correctly

Now you can use your icons with your `font-family: my-name`, e.g.:

```html
<!--example.html-->
<i class="my-name">icon_file_name</i>
```

### SCSS

When using `scss` you can also use `@forward` to include the generated files:

```scss
@forward "public/font-face";
```

### data-icon

If you like to use a custom icon in one of our components you can do it by overwriting the default font-family like this:

```html
<!--example.html-->
<p class="icon-family-my-name" data-icon="icon_file_name">Test</p>

<!-- or -->
<p data-icon-family="my-name" data-icon="icon_file_name">Test</p>
```

### CSS

You can overwrite custom-icons for our components with CSS as well:

```css
.db-button {
  --db-icon-font-family: "my-name";
}
```
