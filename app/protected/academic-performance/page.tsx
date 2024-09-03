// File: /app/protected/page.tsx
'use client'

import { useEffect } from 'react'
import useStore from './store/useStore'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { sponsee, sponsor, isLoading, error, fetchData } = useStore()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (error && error.includes('Authentication error')) {
      router.push('/sign-in')
    }
  }, [error, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!sponsee || !sponsor) {
    return <div>No data available</div>
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="text-3xl font-bold">Protected Page</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Sponsor Information</h2>
        <p><strong>Name:</strong> {sponsor['First name']} {sponsor['Last name']}</p>
        <p><strong>Email:</strong> {sponsor.Email}</p>
        <p><strong>Donation Amount:</strong> ${sponsor.Amount}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <img src={sponsee.profile || ''} alt={`${sponsee['First Name']} ${sponsee['Last Name']}`} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-4">{sponsee['First Name']} {sponsee['Last Name']}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Gender:</strong> {sponsee.gender}</p>
            <p><strong>Location:</strong> {sponsee.location}</p>
            <p><strong>Grade:</strong> {sponsee.grade}</p>
          </div>
          <div>
            <p><strong>Aspiration:</strong> {sponsee.aspiration}</p>
            <p><strong>Date of Birth:</strong> {sponsee.bod ? new Date(sponsee.bod).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Bio:</h3>
          <p>{sponsee.bio}</p>
        </div>
      </div>
    </div>
  )
}