# SPIRITSWAP V2

New SpiritSwap version.

## How to use it

To run locally on your computer please use the command [yarn](https://yarnpkg.com/).

- To Install Dependencies

```bash
yarn
```

- To Run

```bash
yarn start
```

- To Build

```bash
yarn build
```

if you want to build for a specific subdirectory

```bash
yarn build --env rootPath=/<path>/<to>/<subfolder>/

```

---

### - How to add new tokens

> For token icons:

1. Get the token image with `PNG` format.
2. The image not have to have bigger than 200x200px.
3. The name of the token have to be the `symbol`
4. The image name have to be in `upperCase`
5. Put the images inside folder: `public/images/tokens`

#####Examples:

- `Fantom` it will be `FTM.png` --> in `public/images/tokens/FTM.png`
- `Bitcoin` it will be `BTC.png` --> in `public/images/tokens/BTC.png`

> For the token address:

1. Get the next data from the token:
   - `name`
   - `symbol`
   - `chainId`
   - `address`
   - `decimals`
2. Create a object like this:
   ```javascript
   const FTM = {
     name: 'Fantom',
     symbol: 'FTM',
     chainId: 250,
     address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
     decimals: 18,
   };
   ```
3. Add it into the `tokens array` in `src/constants/tokens.ts`
4. Verify that the token have liquidity on spiritswap with [paraswap](https://app.paraswap.io/#/?network=fantom). On Paraswap settings, only enabled spiritswapV2.
5. Verify that the token show the price information on spiritswap. If doesn't show, we need to contact to Covalent Team

---

### Storybook

Run inside another terminal:

```bash
yarn storybook
```

This loads the stories from `./stories`.

> NOTE: Stories should reference the components as if using the library, similar to the example playground. This means importing from the root project directory. This has been aliased in the tsconfig and the storybook webpack config as a helper.

### Jest

Run inside another terminal:

```bash
yarn test
```

If you do some HTML changes, please update the tests.

This loads the tests from `./test`.

It really important to have many tests as possible if the package start growing to avoid future issues.

### Example

Then run the example inside another:

```bash
cd example
yarn
yarn start
```

### GitHub Actions

One actions are added by default:

We use a semantic versioning to update the build or changes that we have on the project. They way to handle this is using a command

```bash
git add .
yarn run commit
git push
```
