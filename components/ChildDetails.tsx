import { Male, MapPin, Calendar, Book } from 'lucide-react';

const ChildDetails = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Child Details</h2>
      <div className="flex">
        <img src="/child-image.jpg" alt="Nebiyu Endrias" className="w-1/3 rounded-lg" />
        <div className="ml-6">
          <h3 className="text-xl font-semibold">Nebiyu Endrias</h3>
          <p className="text-purple-600 dark:text-purple-400">Aspires to be a doctor</p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Nebiyu is a 17-year-old boy who lives with his mother Abebech Fanta, a stay-at-home mother, and his 4-year-old brother Abenezer Endrias. The family lives in Halesh, a region in Boreda Arba Minch where Malaria is a common disease. Nebiyu's family indicated that they have insufficient food in the house. They do not have a stable house to live in.
          </p>
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center">
              <Male className="mr-2" size={16} />
              <span>Male</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" size={16} />
              <span>Ethiopia</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={16} />
              <span>17 years old</span>
            </div>
            <div className="flex items-center">
              <Book className="mr-2" size={16} />
              <span>Grade 12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;