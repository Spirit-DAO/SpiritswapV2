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
