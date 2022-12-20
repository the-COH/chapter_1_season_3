import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import middleware from "./middleware-func"
import * as fs from "fs"

import { pinataSdk } from "../../../utils/pinata"

const handler = nextConnect()

handler.use(middleware)

handler.post(async (_req: NextApiRequest, _res: NextApiResponse) => {
	const stream = fs.createReadStream((_req as any).files.file.filepath)
	try {
		const { IpfsHash } = await pinataSdk.pinFileToIPFS(stream, {
			pinataMetadata: {
				name: "TEST"
			},
			pinataOptions: {
				cidVersion: 1
			}
		})
		return _res.json({ IpfsHash })
	} catch(err) {
		console.error(err)
	}
})

export const config = {
	api: {
		bodyParser: false
	}
}

export default handler