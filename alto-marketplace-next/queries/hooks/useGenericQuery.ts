import { useEffect, useState } from "react"
import useSWR from "swr"

export function useGenericQuery(args: any[] | null, fetcher: (query: any, args: any) => Promise<any>) {
	const [ laggingData, setLaggingData ] = useState<any>(undefined)

	const { data, error, ...rest } = useSWR(args, fetcher)

	useEffect(() => {
		if (!data) return

		setLaggingData(data)
	}, [ data ])

	return {
		loading: !error && typeof data === "undefined",
		data: data || laggingData, // allow old data to persist through errors and loading states
		error,
		...rest
	}
}