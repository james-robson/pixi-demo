# pixijs-demo

Getting started repo for the basics of [PixiJS](http://www.pixijs.com/).

## Prerequisites

You will need `node` installed. This project was tested on `node` version `v6.4.0`

## Running

Clone this repo. Next `cd` into the root directory and install the dependencies with:

```
npm install
```

Use the following command to start the development server:

```
npm run start
```

The dev server should be running on port `8080`.

## Building

Building is easy! Just run:

```
npm run build
```

The build output will be written to the `docs` directory. This directory is under source control so that it can be
hosted on GitHub Pages (see below).

## Deployment

As the build output is written to a `docs` directory, the game is playable by visiting:

[https://james-robson.github.io/pixijs-demo/](https://james-robson.github.io/pixijs-demo/)

Any subsequent pushes/merges to the master branch `docs` directory will redeploy the new build assets.

# TODO

* Speed up ball gradually during play
* Different colour schemes would be nice

