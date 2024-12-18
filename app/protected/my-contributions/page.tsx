'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { useToast } from '@/components/use-toast';

interface Donation {
  id: number;
  donation_amount: string | number;
  description: string | null;
  donation_date: string;
  created_at: string;
  updated_at: string;
  sponsor_name_id: number;
  running_total?: number;
}

interface DonationStats {
  total_donations: number;
  total_amount: number;
  average_donation: number;
  first_donation: string | null;
  last_donation: string | null;
  monthly_donations_count: number;
  one_time_donations_count: number;
  monthly_total: number;
  one_time_total: number;
}

const initialStats: DonationStats = {
  total_donations: 0,
  total_amount: 0,
  average_donation: 0,
  first_donation: null,
  last_donation: null,
  monthly_donations_count: 0,
  one_time_donations_count: 0,
  monthly_total: 0,
  one_time_total: 0,
};

function DonationTable({ donations }: { donations: Donation[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Running Total</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  {format(new Date(donation.donation_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(donation.donation_amount))}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(donation.running_total || 0))}
                </TableCell>
                <TableCell className="capitalize">
                  {donation.description?.toLowerCase().includes('monthly')
                    ? 'Monthly'
                    : donation.description?.toLowerCase().includes('one-time')
                      ? 'One-time'
                      : 'Unknown'}
                </TableCell>
                <TableCell>{donation.description || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function MyContributions() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDonations() {
      try {
        // Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user?.email) {
          toast({
            title: 'Authentication required',
            description: 'Please sign in to view your contributions',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        console.log('Fetching donations for:', session.user.email);

        // Get the sponsor ID
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsors')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (sponsorError || !sponsorData) {
          console.error('Sponsor lookup error:', sponsorError);
          throw sponsorError;
        }

        console.log('Found sponsor ID:', sponsorData.id);

        // First, get the total count of donations
        const { count, error: countError } = await supabase
          .from('donation_collection')
          .select('*', { count: 'exact', head: true })
          .eq('sponsor_name_id', sponsorData.id);

        if (countError) {
          console.error('Count error:', countError);
          throw countError;
        }

        console.log('Total donations count:', count);

        // Now fetch all donations using the count as the limit
        const { data: donationsData, error: donationsError } = await supabase
          .from('donation_collection')
          .select(
            `
            id,
            donation_amount,
            description,
            donation_date,
            created_at,
            updated_at,
            sponsor_name_id
          `
          )
          .eq('sponsor_name_id', sponsorData.id)
          .order('donation_date', { ascending: true })
          .limit(count || 100);

        if (donationsError) {
          console.error('Donations fetch error:', donationsError);
          throw donationsError;
        }

        console.log('Raw donations data:', donationsData);

        if (!donationsData || donationsData.length === 0) {
          setStats(initialStats);
          setDonations([]);
          setLoading(false);
          return;
        }

        // Process donations and calculate running total
        let runningTotal = 0;
        const processedDonations = donationsData.map((donation) => {
          const amount = Number(donation.donation_amount);
          runningTotal += amount;
          return {
            ...donation,
            donation_amount: amount,
            running_total: runningTotal,
          };
        });

        console.log('Processed donations:', processedDonations);

        // Calculate statistics
        const totalAmount = processedDonations.reduce(
          (sum, d) => sum + Number(d.donation_amount),
          0
        );
        const monthlyDonations = processedDonations.filter((d) =>
          d.description?.toLowerCase().includes('monthly')
        );

        const newStats: DonationStats = {
          total_donations: processedDonations.length,
          total_amount: totalAmount,
          average_donation: totalAmount / processedDonations.length,
          first_donation: processedDonations[0].donation_date,
          last_donation:
            processedDonations[processedDonations.length - 1].donation_date,
          monthly_donations_count: monthlyDonations.length,
          one_time_donations_count:
            processedDonations.length - monthlyDonations.length,
          monthly_total: monthlyDonations.reduce(
            (sum, d) => sum + Number(d.donation_amount),
            0
          ),
          one_time_total:
            totalAmount -
            monthlyDonations.reduce(
              (sum, d) => sum + Number(d.donation_amount),
              0
            ),
        };

        console.log('Calculated stats:', newStats);

        setStats(newStats);
        setDonations(processedDonations);
      } catch (error) {
        console.error('Error in fetchDonations:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch donations. Please try again later.',
          variant: 'destructive',
        });
        setStats(initialStats);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, [supabase, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Contributions</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.total_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total amount donated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_donations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Number of donations made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.average_donation)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average amount per donation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              First Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.first_donation
                ? format(new Date(stats.first_donation), 'MMM d, yyyy')
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Date of first contribution
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Donations</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="one-time">One-time</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <DonationTable donations={donations} />
            </TabsContent>

            <TabsContent value="monthly">
              <DonationTable
                donations={donations.filter((d) =>
                  d.description?.toLowerCase().includes('monthly')
                )}
              />
            </TabsContent>

            <TabsContent value="one-time">
              <DonationTable
                donations={donations.filter((d) =>
                  d.description?.toLowerCase().includes('one-time')
                )}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
