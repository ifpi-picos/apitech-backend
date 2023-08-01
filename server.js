const { construirApp } = require('./dist/app')

construirApp.then(app => {
	app.listen(process.env.PORT || 3000, () => { console.log(`Servidor iniciado na porta ${process.env.PORT || 3000}`) })
})
