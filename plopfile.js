/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json')

const data = {
  repository: pkg.repository,
  year: new Date().getFullYear()
}

module.exports = plop => {
  plop.setGenerator('package', {
    description: 'Basic Pacote package.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name:',
        validate: value => (/.+/.test(value) ? true : 'Required.')
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description:'
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name:',
        default: pkg.author.name
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email:',
        default: pkg.author.email
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: 'Author URL:',
        default: pkg.author.url
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/{{ name }}/LICENSE',
        templateFile: 'templates/basic/LICENSE.hbs',
        data
      },
      {
        type: 'addMany',
        destination: 'packages/{{ name }}',
        base: 'templates/basic',
        templateFiles: '**/*.*.hbs',
        data
      }
    ]
  })
}
