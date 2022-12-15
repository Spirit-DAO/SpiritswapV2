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

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `npm run size` and visulize it with `npm run analyze`.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

### GitHub Actions

One actions are added by default:

- `node` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix

We use a semantic versioning to update the build or changes that we have on the project. They way to handle this is using a command

```bash
git add .
yarn run commit
git push
```
