import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { url } = req.query

	try {
		const { data } = await axios.get(url as string)
		res.status(200).send(data)
	} catch(_) {
		res.status(404)
	}
}