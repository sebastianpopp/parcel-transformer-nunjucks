const { Transformer } = require('@parcel/plugin');
const nunjucks = require('nunjucks');

module.exports = new Transformer({
    async loadConfig({config}) {
        const { contents, filePath } =
            (await config.getConfig([
                '.nunjucksrc',
                '.nunjucksrc.js',
            ])) || {
                autoescape: true,
            };

        if (contents) {
            config.invalidateOnFileChange(filePath);
        }

        return contents;
    },

    transform({asset, config}) {
        // Configure Nunjucks
        const env = nunjucks.configure('./', {
            ...config,
            watch: false,
            web: null,
            express: null,
        });

        // Run the register function from the config
        if (config.register) {
            config.register({
                nunjucks,
                env,
                asset,
            });
        }

        // Invalidate included files
        env.on('load', function(name, source, loader) {
            asset.invalidateOnFileChange(name);
        });

        // Render the asset
        asset.type = 'html';
        asset.setCode(nunjucks.render(asset.filePath));

        return [asset];
    },
});
