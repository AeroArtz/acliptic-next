'use client'

import { useSearchParams } from "next/navigation"

export const useStreamParams = () => {
  const params = useSearchParams()
  const streamId = params.get('streamId')
  const userId = params.get('user_id')
  
  return { streamId, userId }
}
