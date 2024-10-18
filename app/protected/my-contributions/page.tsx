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
import { InfoIcon, DollarSign, Calendar, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface Sponsor {
  amount: number | null;
  first_payment_date: string | null;
  last_payment_date: string | null;
}

const MyContributions = () => {
  const [contributions, setContributions] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSponsorData = async () => {
    setLoading(true);
    setError(null);
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

        setContributions(data as Sponsor);
      }
    } catch (err) {
      console.error('Error fetching sponsor data:', err);
      setError('Failed to fetch sponsor data');
      toast({
        title: 'Error',
        description:
          'Failed to fetch your contribution data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    return amount ? `$${amount.toFixed(2)}` : '$0.00';
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    tooltip,
  }: {
    title: string;
    value: string;
    icon: React.ElementType;
    tooltip?: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm font-medium">
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Contributions</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-red-500 mb-4">Error: {error}</p>
            <Button onClick={fetchSponsorData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Contributions</h1>
        <Button onClick={fetchSponsorData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="ALL-TIME DONATIONS"
          value={formatCurrency(contributions?.amount ?? null)}
          icon={DollarSign}
          tooltip="Total amount donated since you became a sponsor"
        />
        <StatCard
          title="CONTACT SINCE"
          value={formatDate(contributions?.first_payment_date ?? null)}
          icon={Calendar}
          tooltip="The date of your first contribution"
        />
        <StatCard
          title="CONTACT TYPE"
          value="Monthly Donor"
          icon={Users}
          tooltip="Your current sponsorship type"
        />
      </div>

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
                  {formatDate(contributions?.last_payment_date ?? null)}
                </TableCell>
                <TableCell>
                  {formatCurrency(contributions?.amount ?? null)}
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
