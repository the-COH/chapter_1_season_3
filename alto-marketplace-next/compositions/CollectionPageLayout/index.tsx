import { useMemo, useState } from "react"
import styled from "styled-components"

import { ERC721CollectionOptional, Filter, QuerySortOptions } from "../../types"

import { useTokenMetadata, useWhitelistedCollection } from "../../hooks"
import { useCollectionTokensWithMarkets } from "../../queries/hooks"

import { Flex } from "../../styles"
import { Header } from "./Header"
import { CollectionWithFilteringAndSorting } from "../../components/CollectionWithFilteringAndSorting"

const Container = styled(Flex)`
  width: 100%;
  gap: 48px;
`

export type CollectionPageLayoutProps = {
  contract: string,
  collection: ERC721CollectionOptional
}

export function CollectionPageLayout({ contract, collection }: CollectionPageLayoutProps) {
  const [ sortByTokens, setSortByTokens ] = useState<QuerySortOptions | undefined>(undefined)
  const [ sortByAsks, setSortByAsks ] = useState<QuerySortOptions | undefined>(undefined)

  const {
    loading,
    tokensWithMarkets,
    error,
    floorPrice,
    owners
  } = useCollectionTokensWithMarkets({
    contract,
    sortByTokens,
    sortByAsks
  })

  const {
    metadataTransform = undefined,
    traits = {},
    thumbnail = undefined
  } = useWhitelistedCollection(contract)

  const { uri, identifier } = tokensWithMarkets[0] || {}

  const { image } = useTokenMetadata(
    !thumbnail
      ? {
        contract,
        uri,
        identifier,
        metadataTransform
      }
      : undefined
  )

  const traitFilters = useMemo(() => (
    Object.entries(traits).map(([ key, arr ]) => (
      new Filter({
        type: "boolean",
        label: key,
        exclusiveOptions: false,
        options: arr.map((trait) => ({
          label: trait,
          value: false,
          // filter: (token: any, value: boolean) => {
          //   if (!value) return true

          //   if (!token.traits || !token.traits.length) return false
          //   const t = token.traits.find(({ trait_type }: { trait_type: string }) => trait_type === key)
          //   return t && t.value === trait
          // }
          filter: () => true
        }))
      })
    ))
  ), [ traits ])

  return (
    <Container column>
			<Header
				collectionName={collection.name}
				contract={contract}
				image={thumbnail || image}
				floorPrice={floorPrice}
				owners={owners}
			/>
      <CollectionWithFilteringAndSorting
        tokens={tokensWithMarkets}
        loading={loading}
        error={error}
        traitFilters={traitFilters}
        setSortByTokens={setSortByTokens}
        setSortByAsks={setSortByAsks}
        // showCount={true}
      />
    </Container>
  )
}
