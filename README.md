# Backend Template - A DAO Node.js Express template

[npm-image]: https://img.shields.io/npm/v/covetfs.svg
[npm-url]: https://www.npmjs.com/package/covetfs

This is a DAO (Document Access Object) Node.js Express template. The architecture supports both MongoDB and SQL databases, but it is configured with MongoDB by default.

Support us on <a href="https://www.patreon.com/honeyside"><strong>Patreon</strong></a> to get priority updates on our development plan and <strong>voting power on new features</strong>.

## How to use

Fork this repo and start working on your project!

Remember to `cp .env.example .env` and set up your `.env` file before diving into code.

Run `yarn dev` to start a nodemon development instance.
Run `yarn start` to start a production environment.

The *evil linter* is enabled by default. The app will not start unless you have **zero** eslint errors. You should really avoid disabling it: it's there for a reason, to provide maximum code quality.

## Project structure

* Everything that relates to the database is inside the `src/dao` folder and *should not get out of that folder*. If you ever choose to change database, for example move from MongoDB to MySQL, you should only replace the contents of the `src/dao` folder.
* Support for multi-language is in the `src/dictionary` folder.
* Routing is in the `src/routes` folder.
* Yup validation for routing fields is in the `src/validation` folder.
* Authentication strategies are in the `src/strategies` folder.
* Plug-in systems such as the mail scheduler, the socket are in the `src/systems` folder.
* HTML templates (for example, mail templates) are in the `src/templates` folder.
* Utils are functions that might be of help everywhere. You'll find them in the `src/utils` folder.

## Contributing

Feel free to open an Issue or send us a direct message.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Honeyside/CovetFS/tags). 

## Author

* **Honeyside** - [Honeyside](https://github.com/Honeyside)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
