import PinataSdk from "@pinata/sdk"

export const pinataSdk = new PinataSdk({
	pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
	pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_API_SECRET
})