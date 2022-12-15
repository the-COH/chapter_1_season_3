import { GetServerSideProps } from "next"

import { Seo } from "../../components/Seo"
import { ProfilePageLayout } from "../../compositions/ProfilePageLayout"

export default function ProfilePage({ ownerAddress = undefined }: { ownerAddress?: string }) {
	return (<>
		<Seo title={`Profile | ${ownerAddress}`}/>
		<ProfilePageLayout ownerAddress={ownerAddress}/>
	</>)
}

interface ManageNftsProps extends GetServerSideProps {
	params?: {
		address?: string
	}
}

export const getServerSideProps = async ({ params = {} }: ManageNftsProps) => {
	const ownerAddress = params.address || null

	return {
		props: {
			ownerAddress,
		},
	}
}
