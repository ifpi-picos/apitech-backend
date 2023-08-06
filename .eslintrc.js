module.exports = {
	'env': {
		'es2021': true,
		'jest': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended'
	],
	'overrides': [
		{
			'files': ['**/*.js'],
			'rules': {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
		{
			'files': ['src/**/*.ts'],
			'rules': {},
		},
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint',
		'jest'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
