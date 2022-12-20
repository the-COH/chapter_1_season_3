import { ChangeEvent, useCallback, useState } from "react"
import Image from "next/image"
import * as Yup from "yup"
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikHelpers } from "formik"
import styled, { useTheme } from "styled-components"
import { isAddress } from "ethers/lib/utils"

import { defaultCurrency } from "../../constants"

import { ERC721Trait } from "../../types"

import { useAuth, useWindowWidth } from "../../hooks"

import { Button, CTAButton, Flex, Grid, Text } from "../../styles"
import { FormSection } from "./FormSection"
import { PreviewCard } from "./PreviewCard"
import { FormSelectionBox } from "./FormSelectionBox"
import { ConnectButton } from "../../components/ConnectButton"

const Container = styled(Flex)`
	width: 100%;
	position: relative;
`

const Content = styled(Flex)`
	max-width: 880px;
`

const SectionContent = styled(Flex).attrs(({ width = "100%" }: any) => ({
	width
}))<{ padding?: number | string }>`
	padding: ${({ padding = 16 }) => typeof padding === "number"
		? `${padding}px`
		: padding
	};
	border: ${({ theme }) => theme.border.thin};
`
const SectionContentDashed = styled(SectionContent)`
	border: 1px dashed ${({ theme }) => theme.accentColor.cream};
`

const SectionInput = styled.input`
	border: ${({ theme }) => theme.border.thin};
	outline: none;
	width: 100%;
	background-color: transparent;
	padding: 16px;

	&[type="number"] {
		max-width: 420px;
	}
`

const RemoveButton = styled(Button)`
	margin: 4px 0;
`

export const createSingleFormSchema = Yup.object().shape({
	ownerAddress: Yup.string().optional(),
	// mintNetwork: Yup.string().required(),
	asset: Yup.mixed().nullable().required(),
	name: Yup.string().min(1).required(),
	description: Yup.string().optional(),
	royalty: Yup.object().shape({
		address: Yup.string().when("fee", {
			is: (value?: number) => !!value,
			then: (schema: Yup.StringSchema) => schema.required(),
			otherwise: (schema: Yup.StringSchema) => schema.optional()
		}),
		fee: Yup.number().min(0).max(50)
	}).nullable().optional(),
	traits: Yup.array().of(Yup.object().shape({
		trait_type: Yup.string().min(1).required("Trait type must not be empty"),
		value: Yup.string().min(1).required("Trait value must not be empty")
	})).max(10, "You can add a maximum of 10 traits").optional()
})

export const createMultipleFormSchema = createSingleFormSchema.concat(
	Yup.object().shape({
		copies: Yup.number().min(1).max(100).required()
	})
)

const validateAddress = (value: string) => {
	return !value || isAddress(value)
		? undefined
		: "Invalid address"
}
const validateFile = (value: any) => {
	return value instanceof File
		? undefined
		: "Invalid file"
}

export type CreateSoloFormState = {
	ownerAddress?: string,
	// mintNetwork: "CANTO",
	asset?: File,
	copies?: number,
	name: string,
	description: string,
	royalty?: {
		address: string,
		fee: number
	},
	traits: ERC721Trait[]
}

const initialValues: CreateSoloFormState = {
	// mintNetwork: "CANTO",
	name: "",
	description: "",
	royalty: {
		address: "",
		fee: 0
	},
	traits: []
}

type CreateSoloFormProps = {
	multiple?: boolean,
	onSubmit: (values: any) => void
}

export function CreateSoloForm({ multiple = false, onSubmit }: CreateSoloFormProps) {
	const theme = useTheme()
	const { widerThanLarge } = useWindowWidth()

	const { address: connectedAddress } = useAuth()

	const trimmedAddress = connectedAddress
		? connectedAddress.slice(0, 4) + "..." + connectedAddress.slice(connectedAddress.length - 4)
		: "Please connect your wallet"
	
	const [ assetURL, setAssetURL ] = useState("")
	
	const handleOnSubmit = useCallback(async (
		values: CreateSoloFormState,
		{ setSubmitting }: FormikHelpers<CreateSoloFormState>
	) => {
		setSubmitting(true)
		console.log(values, connectedAddress)
		await onSubmit({
			...values,
			ownerAddress: connectedAddress
		})
		setSubmitting(false)
	}, [ connectedAddress, onSubmit ])

	return (
		<Formik
			initialValues={multiple
				? { ...initialValues, copies: 1 }
				: initialValues
			}
			validationSchema={multiple
				? createMultipleFormSchema
				: createSingleFormSchema
			}
			validateOnMount={true}
			onSubmit={handleOnSubmit}>
			{({ values, isValid, setFieldValue }) => (
				<Form>
					<Container
						column={!widerThanLarge}
						align={!widerThanLarge ? "center": "flex-start"}
						gap={24}>
						<Content
							column
							gap={24}
							width="100%">
							<FormSection
								heading="Wallet & Network"
								subheading={`The NFT will be minted on the selected network and will be owned by the specified address`}>
								<SectionContentDashed gap={24}>
									<Image
										src={defaultCurrency.icon || ""}
										width={48}
										height={48}
										alt="C"
										style={{ borderRadius: "999px" }}
									/>
									<Flex
										column
										gap={12}>
										<Text fontWeight="bolder">{trimmedAddress}</Text>
										<Text>Canto</Text>
									</Flex>
								</SectionContentDashed>
							</FormSection>
							<FormSection
								heading="Upload File*"
								subheading="File types supported: .png, .jpeg, .jpg, .svg, .webp, .gif; Max 100MB">
								<ErrorMessage name="asset"/>
								<SectionContentDashed
									justify="center"
									padding="36px 0">
									<Field
										name="asset"
										validate={validateFile}>
										{() => {
											const [ input, setInput ] = useState<HTMLInputElement>()

											return (
												<Flex
													column
													gap={12}
													align="center">
													<input
														style={{ display: "none" }}
														ref={setInput as any}
														type="file"
														accept="image/*"
														onChange={(event: ChangeEvent<HTMLInputElement>) => {
															const file = (event.currentTarget.files || [])[0]
															if (!file) {
																if (assetURL) URL.revokeObjectURL(assetURL)
																setFieldValue("asset", undefined)
																setAssetURL("")
															}
															else {
																if (file.size > 100_000_000) return alert("Uploaded file is exceeds the size limit (100MB)! Upload failed.")
																setFieldValue("asset", file)
																setAssetURL(URL.createObjectURL(file))
															}
														}}
													/>
													<CTAButton
														type="button"
														onClick={() => input && input.click()}>
														Choose File
													</CTAButton>
													<Text>
														{!!values.asset
															? `Asset uploaded successfully - ${values.asset.name}`
															:	`Upload asset to view`
														}
													</Text>
												</Flex>
											)
										}}
									</Field>
								</SectionContentDashed>
							</FormSection>
							{multiple && (
								<FormSection
									heading="Number of Copies"
									subheading="Mint multiple copies of the NFT to sell (default: 1, max: 100)">
									<Field
										as={SectionInput}
										name="copies"
									/>
								</FormSection>
							)}
							<FormSection
								heading="Add to Collection"
								subheading="Add minted NFT to new or existing collection">
								<Flex gap={24}>
									<FormSelectionBox
										label="Create New"
										sublabel="ERC-721"
										disabled
									/>
									<FormSelectionBox
										color={(theme as any).accentColor.jazzBlue}
										label="Alto Collection"
										sublabel="ALTO"
									/>
								</Flex>
							</FormSection>
							<FormSection
								heading="Name*"
								subheading="Unique name of the NFT, which will be displayed instead of the tokenId">
								<ErrorMessage name="name"/>
								<Field
									as={SectionInput}
									name="name"
									placeholder="NFT Name"
								/>
							</FormSection>
							<FormSection
								heading="Description"
								subheading="The description will be included on the NFT's detail page underneath its image">
								<ErrorMessage name="description"/>
								<Field
									as={SectionInput}
									name="description"
									placeholder="NFT Description"
								/>
							</FormSection>
							<FormSection
								heading="Traits"
								subheading="Textual traits that will be displayed on the item's page (optional)">
								<FieldArray name="traits">
									{({ remove, push }) => (
										<Flex
											column
											gap={12}>
											{values.traits.map((_, i) => (
												<Grid
													key={i}
													columns="1fr 1fr max-content"
													align="flex-end"
													gap={8}>
													<Flex column>
														<ErrorMessage name={`traits[${i}].trait_type`}/>
														<Field
															as={SectionInput}
															name={`traits[${i}].trait_type`}
															placeholder="Trait Type"
														/>
													</Flex>
													<Flex column>
														<ErrorMessage name={`traits[${i}].value`}/>
														<Field
															as={SectionInput}
															name={`traits[${i}].value`}
															placeholder="Trait Value"
														/>
													</Flex>
													<RemoveButton type="button" onClick={() => remove(i)}>Remove</RemoveButton>
												</Grid>
											))}
											{values.traits.length < 10 && (
												<Button
													type="button"
													fitContent
													onClick={() => push({
														trait_type: "",
														value: ""
													})}>
													+ Add New Trait
												</Button>
											)}
										</Flex>
									)}
								</FieldArray>
							</FormSection>
							<FormSection
								heading="Creator Royalty Fee"
								subheading="Creators can collect a fee when any use re-sells an item they created (Max precision: 2 decimal places)">
								<ErrorMessage name="royalty.fee"/>
								<Flex
									align="center"
									gap={12}>
									<Field
										as={SectionInput}
										name="royalty.fee"
										type="number"
										placeholder="Default: 0%, Suggested: 1%, 5%, 6.9%, 10%, Maximum: 50%"
										step="0.05"
									/>
									<Text>%</Text>
								</Flex>
								<ErrorMessage name="royalty.address"/>
								<Field
									as={SectionInput}
									name="royalty.address"
									placeholder="Address where royalty payments will be sent"
									validate={validateAddress}
								/>
							</FormSection>
							{widerThanLarge && (
								!connectedAddress
									? <ConnectButton/>
									: (
										<CTAButton
											type="submit"
											fitContent
											disabled={!isValid}>
											REVIEW
										</CTAButton>
									)
							)}
						</Content>
						<PreviewCard
							name={values.name}
							ownerAddress={connectedAddress || ""}
							previewURL={assetURL}
						/>
						{!widerThanLarge && (
							!connectedAddress
								? <ConnectButton/>
								: (
									<CTAButton
										type="submit"
										fitContent
										disabled={!isValid}>
										REVIEW
									</CTAButton>
								)
						)}
					</Container>
				</Form>
			)}
		</Formik>
	)
}