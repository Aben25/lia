'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from '@/utils/supabase/client';
import { InfoIcon } from 'lucide-react';

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [largestDonation, setLargestDonation] = useState(0);
  const [contactSince, setContactSince] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('Sponsors')
            .select('*')
            .eq('Email', user.email);

          if (error) throw error;

          setContributions(data);
          const total = data.reduce((sum, contribution) => sum + contribution.Amount, 0);
          setTotalAmount(total);
          setLargestDonation(Math.max(...data.map(c => c.Amount)));
          setContactSince(new Date(Math.min(...data.map(c => new Date(c['First payment date (America/New_York)'])))).toLocaleString('default', { month: 'long', year: 'numeric' }));
        }
      } catch (err) {
        setError('Failed to fetch contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Contributions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>ALL-TIME DONATIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">${totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
    

        <Card>
          <CardHeader>
            <CardTitle>CONTACT SINCE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{contactSince}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              CONTACT TYPE 
              <InfoIcon className="ml-2 h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">Monthly donor</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Contributions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="First payment date (America/New_York)" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(contribution['First payment date (America/New_York)']).toLocaleDateString()}</TableCell>
                  <TableCell>${contribution.Amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyContributions;