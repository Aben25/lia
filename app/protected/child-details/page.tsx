// File: /app/protected/child-details/page.tsx
'use client'

import { useEffect } from 'react'
import useStore from '@/app/store/useStore'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ChildDetails() {
  const { sponsees, fetchSponseeData } = useStore()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        await fetchSponseeData(user.email)
      }
    }
    fetchData()
  }, [])

  if (sponsees.length === 0) {
    return <div>Loading...</div>
  }

  const sponsee = sponsees[0]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Child Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <img src={sponsee.profile} alt={`${sponsee['First Name']} ${sponsee['Last Name']}`} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-4">{sponsee['First Name']} {sponsee['Last Name']}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Gender:</strong> {sponsee.gender}</p>
            <p><strong>Location:</strong> {sponsee.location}</p>
            <p><strong>Grade:</strong> {sponsee.grade}</p>
          </div>
          <div>
            <p><strong>Aspiration:</strong> {sponsee.aspiration}</p>
            <p><strong>Date of Birth:</strong> {new Date(sponsee.bod).toLocaleDateString()}</p>
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