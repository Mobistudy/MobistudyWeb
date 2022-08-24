# Mobistudy Web

This repository contains the frontend of the Mobistudy web server.
The frontend is developed as a single-page app using the [quasar framework](https://quasar-framework.org/).

## Pre requisites

You need to install the following on your system:

- nodejs
- (optional) the [quasar command line tool](https://quasar.dev/quasar-cli/installation)

In order to guarantee that the same version of node is used across developers, it is recommendable to use [nvm](https://github.com/nvm-sh/nvm) and run `nvm install && nvm use` to switch to the node version used in this project.

Install all dependencies with `npm install`.

## Run

To start the interface, run `npm run dev` or, if you have installed the quasar cli, `quasar dev`.
You will need the MobistudyAPI running in parallel (see MobistudyAPI README).

## Test

```bash
npm run test:unit
```

If you want to have quasar and the tests running in parallel and watching for code changes:

```bash
npm run concurrently:dev:jest
```

## Develop

The code is written mostly in ES6 and uses ES6 modules, please be consistent.
If you use VS Code, follow the [recommended settings from Quasar](https://quasar.dev/start/vs-code-configuration#Introduction).

## Deploy

Run `quasar build`. This will generate the material UI interfaces and make it available under `./dist/`

## Docker

This only explains how to build and run the Docker instance of this project.
For the full setup including database and web interface, see the
[Wiki](https://github.com/Mobistudy/MobistudyAPI/wiki/Docker-setup).

Build the docker instance:

```bash
docker build -t mobistudyweb .
```

Then run it with:

```bash
docker run -d -p 80:80 --name mobistudyweb mobistudyweb
```

This will launch an ngnix instance that serves the static content, but not the API.
You will need the API running as well!

## Credits

Original idea: [Dario Salvi](https://github.com/dariosalvi78) and [Carmelo Velardo](https://github.com/2dvisio).

Coordination: [Dario Salvi](https://github.com/dariosalvi78) and [Carl Magnus Olsson](https://github.com/Trasselkalle).

Development:

- [Dario Salvi](https://github.com/dariosalvi78)
- [Arvind Goburdhun](https://github.com/arvgo)
- [Elin Forsnor](https://github.com/elinforsnor)
- [Felix Morau](https://github.com/femosc2)
- [Jacky Tu](https://github.com/jackytu99)
- [Elliott Hellstrand](https://github.com/Elliott0121)
- [Andreas Holm](https://github.com/HeyOooh)
- [Daniel Abella](https://github.com/assimilate)
- [Kevin Tsang](https://github.com/kevinchtsang)
- [Gent Ymeri](https://github.com/gentymeri)

## License

See [license file](LICENSE)
