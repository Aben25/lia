'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  MapPin,
  User,
  GraduationCap,
  Plus,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AcademicChart from './AcademicChart';

interface Child {
  full_name?: string;
  bio?: string;
  location?: string;
  age?: string;
  grade?: string;
  gender?: string;
  profile_picture_url?: string;
  dream?: string;
  education_status?: {
    current_grade: string;
    progress: string;
  };
  health_status?: {
    condition: string;
    last_checkup: string;
  };
  special_needs?: {
    need: string;
    status: string;
  };
}

export default function Component({ child }: { child?: Child } = {}) {
  const [academicData, setAcademicData] = useState<
    {
      month: string;
      English: number;
      Mathematics: number;
      Physics: number;
      Biology: number;
      Chemistry: number;
      Geography: number;
    }[]
  >([]);

  useEffect(() => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      month: [
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ][i],
      English: 80 + Math.random() * 20,
      Mathematics: 75 + Math.random() * 20,
      Physics: 70 + Math.random() * 20,
      Biology: 65 + Math.random() * 25,
      Chemistry: 75 + Math.random() * 20,
      Geography: 70 + Math.random() * 20,
    }));
    setAcademicData(data);
  }, []);

  const mockChild = {
    full_name: child?.full_name || 'Nebiyu Endrias',
    bio:
      child?.bio ||
      "Nebiyu Endrias is a 17-year-old boy who lives with his mother Abebech Fanta, a stay-at-home mother, and his 4-year-old brother Abenezer Endrias. The family lives in Halesh, a region in Boreda Arbaminch where Malaria is a common disease. Nebiyu's family indicated that they have insufficient food in the house. They do not have a stable house to live in.",
    location: child?.location || 'Ethiopia',
    age: child?.age || '17 years old',
    grade: child?.grade || 'Grade 12',
    gender: child?.gender || 'Male',
    dream: child?.dream || 'Aspires to be a doctor',
    education_status: child?.education_status || {
      current_grade: '5th',
      progress: '80%',
    },
    health_status: child?.health_status || {
      condition: 'Good',
      last_checkup: '05/20/2024',
    },
    special_needs: child?.special_needs || {
      need: 'Daily Insulin',
      status: 'Good',
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-8">
      <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">Child Details</h1>
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={
                child?.profile_picture_url ||
                '/placeholder.svg?height=256&width=256'
              }
              alt={mockChild.full_name}
              className="w-64 h-64 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl  text-[#1e3a8a]">
                  {mockChild.full_name}
                </h2>
                <p className="text-lg text-gray-600">{mockChild.dream}</p>
              </div>
              <p className="text-gray-600 leading-relaxed">{mockChild.bio}</p>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{mockChild.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{mockChild.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{mockChild.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{mockChild.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl text-[#1e3a8a] mb-8">Academic Performance</h2>
          <div className="">
            <AcademicChart data={academicData} />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl  text-[#1e3a8a] mb-6">Documents</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Document Name</div>
                <div className="text-gray-600">Category</div>
              </div>
              {[
                { name: 'Fall Semester Grade', category: 'Education' },
                { name: 'Spring Semester Grade', category: 'Education' },
                { name: 'Annual Checkup Report', category: 'Medical' },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-[#1e3a8a]">{doc.name}</span>
                  </div>
                  <span className="text-gray-600">{doc.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl text-[#1e3a8a] mb-6">Status</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#fcd34d] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Education Status</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Current Grade: {mockChild.education_status.current_grade}
                    </p>
                    <p>Progress: {mockChild.education_status.progress}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#60a5fa] rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Health Status</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Current Condition: {mockChild.health_status.condition}
                    </p>
                    <p>Last Check-up: {mockChild.health_status.last_checkup}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#c084fc] rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Special Needs</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Need: {mockChild.special_needs.need}</p>
                    <p>Status: {mockChild.special_needs.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
