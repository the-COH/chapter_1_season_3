export const DEV = process.env.NODE_ENV === "development";

// SEO
export const APP_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || ''
export const BASE_URL = process.env.NEXT_PUBLIC_URL || ''
export const OG_IMAGE = `${BASE_URL}/ogimage.jpeg`
export const FAVICON = `${BASE_URL}/alto-logo-v2.png`
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER
export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD

export const APP_LOGO = `${BASE_URL}/alto-logo-v2.png`
export const APP_LOGO_ALT = `${BASE_URL}/alto-logo-circle.png`

export const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ""
export const BLOCK_EXPLORER_BASE_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://evm.explorer.canto.io/"
export const GRAPHQL_ENDPOINT = (DEV || process.env.NEXT_PUBLIC_ENV === "development"
	? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_DEV
	: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
) || ""
export const NETWORK_RPC_URL = process.env.NEXT_PUBLIC_NETWORK_URL || "https://canto.evm.chandrastation.com"
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

// CONTRACTS
export const ZORA_MODULE_MANAGER = process.env.NEXT_PUBLIC_ZORA_MODULE_MANAGER || ""
export const ZORA_PROTOCOL_FEE_SETTINGS = process.env.NEXT_PUBLIC_ZORA_PROTOCOL_FEE_SETTINGS || ""
export const WCANTO = process.env.NEXT_PUBLIC_WCANTO || ""
export const ERC20_TRANSFER_HELPER = process.env.NEXT_PUBLIC_ERC20_TRANSFER_HELPER || ""
export const ERC721_TRANSFER_HELPER = process.env.NEXT_PUBLIC_ERC721_TRANSFER_HELPER || ""
export const ERC1155_TRANSFER_HELPER = process.env.NEXT_PUBLIC_ERC1155_TRANSFER_HELPER || ""
export const ROYALTY_REGISTRY = process.env.NEXT_PUBLIC_ROYALTY_REGISTRY || ""
export const ROYALTY_ENGINE_V1 = process.env.NEXT_PUBLIC_ROYALTY_ENGINE_V1 || ""
export const OFFERS_V1 = process.env.NEXT_PUBLIC_OFFERS_V1 || ""
export const ASKS_V1_1 = process.env.NEXT_PUBLIC_ASKS_V1_1 || ""
export const RESERVE_AUCTION_CORE_ERC20 = process.env.NEXT_PUBLIC_RESERVE_AUCTION_CORE_ERC20 || ""
export const RESERVE_AUCTION_CORE_ETH = process.env.NEXT_PUBLIC_RESERVE_AUCTION_CORE_ETH || ""
export const RESERVE_AUCTION_FINDERS_ERC20 = process.env.NEXT_PUBLIC_RESERVE_AUCTION_FINDERS_ERC20 || ""
export const RESERVE_AUCTION_FINDERS_ETH = process.env.NEXT_PUBLIC_RESERVE_AUCTION_FINDERS_ETH || ""
export const RESERVE_AUCTION_LISTING_ERC20 = process.env.NEXT_PUBLIC_RESERVE_AUCTION_LISTING_ERC20 || ""
export const RESERVE_AUCTION_LISTING_ETH = process.env.NEXT_PUBLIC_RESERVE_AUCTION_LISTING_ETH || ""
export const TEST_NFT = process.env.NEXT_PUBLIC_TEST_NFT || ""
export const ALTO_COMMON_FACTORY = process.env.NEXT_PUBLIC_ALTO_COMMON_FACTORY || ""
export const ALTO_COMMON_COLLECTION = process.env.NEXT_PUBLIC_ALTO_COMMON_COLLECTION || ""

// TODO: throw error for uninitialized required vars