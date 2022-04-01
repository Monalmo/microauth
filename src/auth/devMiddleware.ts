export async function devMiddleware(req, res, next) {
	try {
		req.token = {
			sub: 'asdasd'
		}
		next()
	} catch (e) {
		console.error(e)

		return res.status(500).send({ error: true, e })
	}
}
