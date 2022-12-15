import { NextApiRequest, NextApiResponse } from "next"

import { pinataSdk } from "../../../utils/pinata"

export default async function handler(_req: NextApiRequest, _res: NextApiResponse) {
	const { metadata } = _req.body

	const options = {
		pinataMetadata: {
			name: "testing"
		}
	}
	try {
		const { IpfsHash } = await pinataSdk.pinJSONToIPFS(metadata, options)
		return _res.json({ IpfsHash })
	} catch(err) {
		console.error(err)
		_res.status(500)
	}
}