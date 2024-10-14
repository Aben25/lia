'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/utils/supabase/client';
import { InfoIcon } from 'lucide-react';

// Define a type for your sponsor
interface Sponsor {
  amount: number | null;
  first_payment_date: string | null;
  last_payment_date: string | null;
}

const MyContributions = () => {
  const [contributions, setContributions] = useState<Sponsor[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [contactSince, setContactSince] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('sponsors')
            .select('*')
            .eq('email', user.email)
            .single();

          if (error) throw error;

          const sponsor = data as Sponsor;

          const totalAmount = sponsor.amount || 0;
          const contactSince = sponsor.first_payment_date
            ? new Date(sponsor.first_payment_date).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })
            : 'Unknown';

          setContributions([sponsor]);
          setTotalAmount(totalAmount);
          setContactSince(contactSince);
        }
      } catch (err) {
        console.error('Error fetching sponsor data:', err);
        setError('Failed to fetch sponsor data');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sponsor = contributions[0];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Contributions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>ALL-TIME DONATIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              ${totalAmount.toFixed(2)}
            </p>
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
            <p className="text-3xl font-bold text-blue-500">Monthly Donor</p>
          </CardContent>
        </Card>
      </div>

      {/* Since we have only one record, you might choose to display the info differently */}
      <Card>
        <CardHeader>
          <CardTitle>Last Payment</CardTitle>
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
              <TableRow>
                <TableCell>
                  {sponsor.last_payment_date
                    ? new Date(sponsor.last_payment_date).toLocaleDateString()
                    : 'Unknown'}
                </TableCell>
                <TableCell>
                  ${sponsor.amount ? sponsor.amount.toFixed(2) : '0.00'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyContributions;
