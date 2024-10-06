/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json')

const data = {
  repository: pkg.repository,
  year: new Date().getFullYear(),
}

module.exports = (plop) => {
  plop.setGenerator('basic', {
    description: 'Basic package.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name:',
        validate: (value) => (/.+/.test(value) ? true : 'Required.'),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description:',
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name:',
        default: pkg.author.name,
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email:',
        default: pkg.author.email,
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: 'Author URL:',
        default: pkg.author.url,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{ name }}/LICENSE',
        templateFile: 'templates/LICENSE.hbs',
        data,
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/.npmignore',
        templateFile: 'templates/npmignore.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/README.md',
        templateFile: 'templates/README.md.hbs',
        data,
      },
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates',
        templateFiles: '**/tsconfig.*.hbs',
        data,
      },
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates/basic',
        templateFiles: '**/*.*.hbs',
        data,
      },
    ],
  })

  plop.setGenerator('react', {
    description: 'React package.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name:',
        validate: (value) => (/.+/.test(value) ? true : 'Required.'),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description:',
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name:',
        default: pkg.author.name,
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email:',
        default: pkg.author.email,
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: 'Author URL:',
        default: pkg.author.url,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{ name }}/LICENSE',
        templateFile: 'templates/LICENSE.hbs',
        data,
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/.npmignore',
        templateFile: 'templates/npmignore.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/README.md',
        templateFile: 'templates/README.md.hbs',
        data,
      },
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates',
        templateFiles: '**/tsconfig.*.hbs',
        data,
      },
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates/react',
        templateFiles: '**/*.*.hbs',
        data,
      },
    ],
  })
}
