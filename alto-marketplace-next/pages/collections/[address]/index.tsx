import { GetServerSideProps } from "next"

import { ERC721CollectionOptional } from "../../../types"

import { collectionByIdWithTokensQuery, fetcher } from "../../../queries"

import { Seo } from "../../../components/Seo"
import { CollectionPageLayout } from "../../../compositions/CollectionPageLayout"

export type CollectionServiceProps = {
  contract: string,
  collection: ERC721CollectionOptional
}

export default function CollectionPage({ contract, collection }: CollectionServiceProps) {
  const { name, symbol } = collection

  return (<>
    <Seo
      title={`${name}${symbol ? ` (${symbol})` : ''} - Collection`}
      description={`${symbol ? symbol + ': ' : ''}Buy, sell and explore ${name} NFTs on Alto`}
    />
    <CollectionPageLayout
      contract={contract}
      collection={collection}
    />
  </>)
}

type CollectionProps = {
  address: string
}

interface CollectionParamsProps extends GetServerSideProps {
  params?: CollectionProps
}

export const getServerSideProps = async ({ params }: CollectionParamsProps) => {
  const contract = params
    ? params.address.toLowerCase()
    : process.env.NEXT_PUBLIC_DEFAULT_CONTRACT

  if (!contract) return false

  try {
    const data = await fetcher(collectionByIdWithTokensQuery, { contract })
    const collection = data?.erc721Contract

    if (!collection) {
      return {
        notFound: true,
        // revalidate: 600,
      }
    }

    return {
      props: {
        contract,
        collection
      },
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err?.message.includes('404')) {
        return {
          notFound: true,
          // revalidate: 60,
        }
      }
      console.warn(err.message)
    }
    throw err
  }
}
