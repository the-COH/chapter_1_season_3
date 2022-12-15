import { NextApiRequest, NextApiResponse } from "next"

import { pinataSdk } from "../../../utils/pinata"

export default async function handler(_req: NextApiRequest, _res: NextApiResponse) {
	const list = await pinataSdk.pinList({})
	return _res.json({ list })
}