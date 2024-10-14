'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SponsorData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const [sponsor, setSponsor] = useState<SponsorData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    region: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
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

          setSponsor(data as SponsorData);
        }
      } catch (err) {
        setError('Failed to fetch sponsor data');
        toast({
          title: 'Error',
          description: 'Failed to fetch sponsor data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSponsor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSponsor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('sponsors')
        .update({
          first_name: sponsor.first_name,
          last_name: sponsor.last_name,
          phone: sponsor.phone,
          address: sponsor.address,
          postal_code: sponsor.postal_code,
          city: sponsor.city,
          region: sponsor.region,
          country: sponsor.country,
        })
        .eq('email', sponsor.email);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Your profile has been updated',
      });
    } catch (err) {
      console.error('Failed to update sponsor data:', err);
      setError('Failed to update sponsor data');
      toast({
        title: 'Error',
        description: 'Failed to update sponsor data',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile Detail</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-gray-500" />
                <div className="flex-grow">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="first_name"
                    value={sponsor.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-gray-500" />
                <div className="flex-grow">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="last_name"
                    value={sponsor.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 md:col-span-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <div className="flex-grow">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={sponsor.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 md:col-span-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <div className="flex-grow">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={sponsor.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div className="flex-grow">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={sponsor.address || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postal_code"
                    value={sponsor.postal_code || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={sponsor.city || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={sponsor.region || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={sponsor.country || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
