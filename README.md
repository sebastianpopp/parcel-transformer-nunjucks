# Parcel Transformer Plugin for Nunjucks

## Installation

```sh
npm i -D parcel-transformer-nunjucks
```

## Configuration

In your `.parcelrc` add the transformer:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.njk": ["parcel-transformer-nunjucks"]
  }
}
```

## Customization

You can customize the Nunjucks configuartion using the `.nunjucksrc` or `.nunjucksrc.js` file.

```json
{
    "autoescape": true,
}
```

For more information, see the [Nunjucks docs](https://mozilla.github.io/nunjucks/api.html#configure).

In addition to the documented options, you can define a `register` function in your `.nunjucksrc.js` file, that is called before rendering the template to register custom filters or globals:

```js
const marked = require('marked');
const fs = require('fs');
const path = require('path');

module.exports = {
    autoescape: true,

    register({nunjucks, env, asset}) {
        // Add markdown filter
        // use like {{ content | markdown }}
        env.addFilter('markdown', function (str) {
            if (!str) {
                return '';
            }

            return new nunjucks.runtime.SafeString(marked.parse(str));
        });

        // Add load function to load JSON files
        // use like {% set data = load('data.json') %}
        env.addGlobal('load', function (name) {
            const filePath = path.resolve(path.dirname(asset.filePath), name);

            asset.invalidateOnFileChange(filePath);

            return JSON.parse(fs.readFileSync(filePath));
        });
    }
};
```
