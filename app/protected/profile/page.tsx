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
import { User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [saving, setSaving] = useState(false);
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
          description:
            'Failed to fetch your profile data. Please try again later.',
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
    setSaving(true);
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
        description: 'Your profile has been updated successfully.',
      });
    } catch (err) {
      console.error('Failed to update sponsor data:', err);
      setError('Failed to update sponsor data');
      toast({
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile Details</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                icon={User}
                label="First Name"
                name="first_name"
                value={sponsor.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <ProfileField
                icon={User}
                label="Last Name"
                name="last_name"
                value={sponsor.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <ProfileField
                icon={Mail}
                label="Email"
                name="email"
                value={sponsor.email}
                onChange={handleInputChange}
                disabled={true}
                className="md:col-span-2"
              />
              <ProfileField
                icon={Phone}
                label="Phone"
                name="phone"
                value={sponsor.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="md:col-span-2"
              />
              <ProfileField
                icon={MapPin}
                label="Address"
                name="address"
                value={sponsor.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="md:col-span-2"
              />
              <ProfileField
                label="Postal Code"
                name="postal_code"
                value={sponsor.postal_code || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <ProfileField
                label="City"
                name="city"
                value={sponsor.city || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <ProfileField
                label="Region"
                name="region"
                value={sponsor.region || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <ProfileField
                label="Country"
                name="country"
                value={sponsor.country || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit" disabled={saving}>
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
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

interface ProfileFieldProps {
  icon?: React.ElementType;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  className?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  disabled,
  className = '',
}) => (
  <div className={`flex items-center space-x-4 ${className}`}>
    {Icon && <Icon className="w-5 h-5 text-gray-500" />}
    <div className="flex-grow">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={disabled ? 'bg-gray-100' : ''}
      />
    </div>
  </div>
);

export default ProfilePage;
