import nextConnect from "next-connect"
import formidable from "formidable"

const form = formidable({ multiples: false })

const middleware = nextConnect()

middleware.use(async function parseMultipartForm(
	req: {
		headers: { [ x: string ]: any },
		body: any,
		files: any
	},
	res: any,
	next: () => void,
) {
	const contentType = req.headers[ "content-type" ]
	if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
		form.parse(req as any, (err: any, fields: any, files: any) => {
			if (!err) {
				req.body = fields;
				req.files = files;
			}
			next()
		})
	}
	else {
		next()
	}
})

export default middleware