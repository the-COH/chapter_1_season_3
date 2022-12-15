import { useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import { Contract } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { ALTO_COMMON_COLLECTION } from "../../utils/env-vars"
import { uploadToPinata } from "../../utils"

import { AltoERC721Individual_ABI } from "../../abis"

import { useAuth, useContractTransaction } from "../../hooks"

import { Button, Flex, Grid, Separator, Text } from "../../styles"
import { CreateSoloFormState } from "./CreateSoloForm"
import { Modal } from "../../components/Modal"
import { NFTHeader } from "../../components/NFTHeader"
import { AddressText } from "../../components/AddressText"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { ErrorDetail } from "../../components/ErrorDetail"
import { ContractInteractionStatus } from "../../components/ContractInteractionStatus"

const DataRow = styled(Flex).attrs(() => ({
	justify: "space-between",
	align: "flex-start",
	gap: 12
}))`
	width: 100%;
	& > *:first-child {
		font-weight: bolder;
	}
	& > *:last-child {
		font-weight: lighter;
	}
`

const TraitPre = styled.pre`
	max-height: 48px;
	margin: 0px;
	padding: 8px;
	overflow-y: scroll;
	box-shadow: inset ${({ theme }) => theme.boxShadow.dark};
`

enum MintStatus {
	REVIEW = "Review the mint settings and hit the submit button to mint",
	UPLOADING = "Uploading your asset to IPFS...",
	MINTING = "Minting your NFT(s). Awaiting approval...",
	CONFIRMATION = "Mint successful!"
}

type MintModalProps = CreateSoloFormState & {
	onClose: () => void,
	resetMintWizard: () => void
}

export function MintModal({
	ownerAddress = "",
	asset,
	copies,
	name,
	description,
	traits,
	royalty,
	onClose,
	resetMintWizard
}: MintModalProps) {
	const { signer } = useAuth()
	const [ error, setError ] = useState<string>()
	const { tx, txStatus, handleTx, txInProgress } = useContractTransaction()

	const [ status, setStatus ] = useState<MintStatus>(MintStatus.REVIEW)

	const contract = useMemo(() => {
		if (!signer) return

		try {
			return new Contract(ALTO_COMMON_COLLECTION, AltoERC721Individual_ABI, signer)
		} catch(err) {
			console.error(err)
			return undefined
		}
	}, [ signer ])

	const onSubmit = useCallback(async () => {
		try {
			if (!contract) {
				throw new Error("The Alto Common Collection contract is not ready, please try again.")
			}

			setStatus(MintStatus.UPLOADING)
			const uri = await uploadToPinata(asset as File, {
				name,
				description,
				attributes: traits
			})
			if (!uri) {
				throw new Error("IPFS upload failed. Please try again.")
			}

			setStatus(MintStatus.MINTING)
			const address = (royalty?.address || ownerAddress).toLowerCase()
			const args: any[] = [
				uri,                                   // uri
				address,                               // receiver
				Math.floor((royalty?.fee || 0) * 100), // feeNumerator (out of 10,000)
				{ value: parseEther("1").toString() }  // _individualFee
			]
			console.log("MintNext: ", args)
			const promise = contract.mintNext(...args)
			await handleTx(promise)

			setStatus(MintStatus.CONFIRMATION)
		} catch(err: any) {
			console.error(err)
			setError(err?.message || "There's been an error, please try again.")
			setStatus(MintStatus.REVIEW)
		}
	}, [ contract, asset, ownerAddress, royalty, traits, handleTx ])

	const [ assetUrl, setAssetUrl ] = useState("")

	useEffect(() => {
		if (!asset) return setAssetUrl("")
		const url = URL.createObjectURL(asset)
		setAssetUrl(url)

		return () => URL.revokeObjectURL(url)
	}, [ asset ])

	const token = {
		id: "",
		identifier: name,
		uri: assetUrl,
		owner: {
			id: ownerAddress
		},
		contract: {
			id: ALTO_COMMON_COLLECTION,
			name: "Alto Common Collection",
			symbol: "ALTO"
		} // TODO: should probably not hardcode here
	}

	return (
		<Modal
			onClose={onClose}
			title="Confirm Mint"
			content={
				!tx
					? (
						<Flex
							column
							gap={16}>
							<NFTHeader
								token={token}
								name={name}
								previewURL={assetUrl}
							/>
							<Separator/>
							<DataRow>
								<Text>Name:</Text>
								<Text>{name}</Text>
							</DataRow>
							{description && (
								<DataRow>
									<Text>Description:</Text>
									<Text>{description}</Text>
								</DataRow>
							)}
							{copies && (
								<DataRow>
									<Text>Copies:</Text>
									<Text>{copies.toLocaleString()}</Text>
								</DataRow>
							)}
							<DataRow>
								<Text>Owner:</Text>
								<AddressText address={ownerAddress}/>
							</DataRow>
							{!!traits.length && (
								<DataRow>
									<Text>Traits:</Text>
									<TraitPre>
										{traits.map(({ trait_type, value }) => `${trait_type}: ${value}`).join(`\n`)}
									</TraitPre>
								</DataRow>
							)}
							<DataRow>
								<Text>Royalty Fee:</Text>
								<Text>{(royalty?.fee || 0).toFixed(2)}%</Text>
							</DataRow>
							{royalty && (
								<DataRow>
									<Text>Royalty Address:</Text>
									<AddressText address={royalty.address}/>
								</DataRow>
							)}
							<Separator/>
							{error
								? <ErrorDetail error={error}/>
								: (
									<Text
										textAlign="center"
										fontSize={12}
										fontWeight="lighter"
										style={{ margin: "8px 0" }}>
										{status}
									</Text>
								)
							}
							<Grid
								columns="1fr 1fr"
								gap={8}>
								<Button onClick={onClose}>Cancel</Button>
								<TransactionSubmitButton
									onClick={onSubmit}
									txStatus={txStatus}
									txInProgress={txInProgress}>
									Submit
								</TransactionSubmitButton>
							</Grid>
						</Flex>
					)
					: (
						<ContractInteractionStatus
							title="Your NFT(s) will be minted shortly!"
							description="Once your transaction has processed, your newly minted NFT(s) will be visible in your wallet/profile"
							previewURL={assetUrl}
							txHash={tx.hash}
							token={token}
							onConfirm={() => {
								resetMintWizard()
								onClose()
							}}
						/>
					)
			}
		/>
	)
}