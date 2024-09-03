// File: /app/protected/donation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import useStore from '@/app/store/useStore'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Donation() {
  const { sponsors, fetchSponsorData } = useStore()
  const [newAmount, setNewAmount] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        await fetchSponsorData(user.email)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would update the donation amount in your database
    console.log('New donation amount:', newAmount)
  }

  if (sponsors.length === 0) {
    return <div>Loading...</div>
  }

  const sponsor = sponsors[0]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Donation</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Donation</h2>
        <p className="text-xl mb-4">You are currently donating <strong>${sponsor.Amount}</strong> per month.</p>
        <form onSubmit={handleSubmit} className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Update Donation Amount</h3>
          <div className="flex items-center">
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="border rounded p-2 mr-2"
              placeholder="New amount"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}