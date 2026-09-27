import React from 'react';
import { Student } from '../../types';
import { StudentEnrollmentRoadmap } from './StudentEnrollmentRoadmap';

interface ApplicantHomeProps {
  activeStudent?: Partial<Student>;
  onLogOut?: () => void;
  onShowAllNotifications?: () => void;
}

export const ApplicantHome: React.FC<ApplicantHomeProps> = ({
  activeStudent,
  onLogOut,
}) => {
  return (
    <StudentEnrollmentRoadmap
      activeStudent={activeStudent}
      onLogOut={onLogOut}
    />
  );
};
