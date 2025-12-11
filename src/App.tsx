import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { CitizenHomeScreen } from './components/citizen/HomeScreen';
import { CitizenReportDetails } from './components/citizen/ReportDetails';
import { CitizenConfirmation } from './components/citizen/Confirmation';
import { WorkerDashboard } from './components/worker/Dashboard';
import { WorkerProgressView } from './components/worker/ProgressView';
import { WorkerAnalytics } from './components/worker/Analytics';
import { ReportDetailsPage } from './components/ReportDetailsPage';
import { BrowseReportsScreen } from './components/BrowseReportsScreen';

export type UserType = 'resident' | 'worker' | null;
export type Screen = 'login' | 'citizen-home' | 'citizen-report' | 'citizen-confirm' | 'worker-dashboard' | 'worker-progress' | 'worker-analytics' | 'report-details' | 'browse-reports';
export type Department = 'Police Department' | 'Sanitation' | 'Public Works' | 'Transportation' | 'Parks & Recreation' | 'General Services';

export interface Report {
  id: string;
  photo?: string;
  category: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  status: 'new' | 'in-progress' | 'completed';
  suggestedDepartment?: string;
}

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [workerDepartment, setWorkerDepartment] = useState<Department | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentReport, setCurrentReport] = useState<Partial<Report>>({});
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('login');
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'REP-2024-1234',
      photo: 'https://images.unsplash.com/photo-1613894811137-b5ee44ba3cb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHdhbGwlMjB1cmJhbnxlbnwxfHx8fDE3NjUwNTI3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Graffiti',
      description: 'Large graffiti on building wall',
      location: '123 Main Street',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'new',
      suggestedDepartment: 'Public Works'
    },
    {
      id: 'REP-2024-1235',
      photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXR0ZXIlMjB0cmFzaCUyMHN0cmVldHxlbnwxfHx8fDE3NjUwNTI3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Litter',
      description: 'Overflowing trash bins',
      location: '456 Oak Avenue',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'in-progress',
      suggestedDepartment: 'Sanitation'
    },
    {
      id: 'REP-2024-1236',
      photo: 'https://images.unsplash.com/photo-1709934730506-fba12664d4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob2xlJTIwcm9hZCUyMGRhbWFnZXxlbnwxfHx8fDE3NjUwNTI3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Infrastructure Issue',
      description: 'Large pothole causing traffic issues',
      location: '789 Elm Street',
      coordinates: { lat: 40.7489, lng: -73.9680 },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'new',
      suggestedDepartment: 'Transportation'
    },
    {
      id: 'REP-2024-1237',
      photo: 'https://images.unsplash.com/photo-1662915029099-e285648c0534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyZ3Jvd24lMjB2ZWdldGF0aW9ufGVufDF8fHx8MTc2NTA1Mjc0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Overgrowth',
      description: 'Sidewalk blocked by overgrown vegetation',
      location: '321 Pine Road',
      coordinates: { lat: 40.7306, lng: -73.9352 },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'completed',
      suggestedDepartment: 'Parks & Recreation'
    }
  ]);

  const handleLogin = (type: UserType, department?: Department) => {
    setUserType(type);
    if (type === 'resident') {
      setPreviousScreen('citizen-home');
      setCurrentScreen('citizen-home');
    } else {
      setPreviousScreen('worker-dashboard');
      setCurrentScreen('worker-dashboard');
      setWorkerDepartment(department || null);
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentScreen('login');
    setPreviousScreen('login');
    setCurrentReport({});
    setSubmittedReportId(null);
    setSelectedReportId(null);
  };

  const handlePhotoCapture = (photo: string) => {
    setCurrentReport({ ...currentReport, photo });
    setCurrentScreen('citizen-report');
  };

  const handleSubmitReport = (report: Partial<Report>) => {
    const newReport: Report = {
      id: `REP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      photo: report.photo || '',
      category: report.category || 'Other',
      description: report.description || '',
      location: report.location || 'Location not specified',
      coordinates: report.coordinates || { lat: 40.7128, lng: -74.0060 },
      timestamp: new Date(),
      status: 'new',
      suggestedDepartment: getSuggestedDepartment(report.category || 'Other')
    };
    
    setReports([newReport, ...reports]);
    setSubmittedReportId(newReport.id);
    setCurrentScreen('citizen-confirm');
  };

  const getSuggestedDepartment = (category: string): string => {
    const departments: { [key: string]: string } = {
      'Vandalism': 'Police Department',
      'Litter': 'Sanitation',
      'Graffiti': 'Public Works',
      'Infrastructure Issue': 'Transportation',
      'Overgrowth': 'Parks & Recreation',
      'Other': 'General Services'
    };
    return departments[category] || 'General Services';
  };

  const handleUpdateReportStatus = (reportId: string, status: 'new' | 'in-progress' | 'completed') => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status } : report
    ));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'citizen-home':
        return <CitizenHomeScreen onPhotoCapture={handlePhotoCapture} onLogout={handleLogout} onBrowseReports={() => setCurrentScreen('browse-reports')} />;
      case 'citizen-report':
        return (
          <CitizenReportDetails 
            photo={currentReport.photo}
            onSubmit={handleSubmitReport}
            onBack={() => setCurrentScreen('citizen-home')}
          />
        );
      case 'citizen-confirm':
        return (
          <CitizenConfirmation 
            reportId={submittedReportId || ''}
            onNewReport={() => {
              setCurrentReport({});
              setCurrentScreen('citizen-home');
            }}
            onLogout={handleLogout}
          />
        );
      case 'browse-reports':
        return (
          <BrowseReportsScreen
            reports={reports}
            isWorker={userType === 'worker'}
            onSelectReport={(reportId) => {
              setSelectedReportId(reportId);
              setPreviousScreen('browse-reports');
              setCurrentScreen('report-details');
            }}
            onBack={() => {
              if (userType === 'worker') {
                setCurrentScreen('worker-dashboard');
              } else {
                setCurrentScreen('citizen-home');
              }
            }}
            onLogout={handleLogout}
          />
        );
      case 'report-details':
        return (
          <ReportDetailsPage
            report={reports.find(r => r.id === selectedReportId) || null}
            isWorker={userType === 'worker'}
            onBack={() => setCurrentScreen(previousScreen as Screen)}
            onLogout={handleLogout}
            onUpdateStatus={userType === 'worker' ? handleUpdateReportStatus : undefined}
          />
        );
      case 'worker-dashboard':
        return (
          <WorkerDashboard 
            reports={reports}
            workerDepartment={workerDepartment}
            onUpdateStatus={handleUpdateReportStatus}
            onNavigate={setCurrentScreen}
            onSelectReport={(reportId) => {
              setSelectedReportId(reportId);
              setCurrentScreen('report-details');
            }}
            onLogout={handleLogout}
          />
        );
      case 'worker-progress':
        return (
          <WorkerProgressView 
            reports={reports}
            workerDepartment={workerDepartment}
            onUpdateStatus={handleUpdateReportStatus}
            onBack={() => setCurrentScreen('worker-dashboard')}
            onLogout={handleLogout}
          />
        );
      case 'worker-analytics':
        return (
          <WorkerAnalytics 
            reports={reports}
            workerDepartment={workerDepartment}
            onBack={() => setCurrentScreen('worker-dashboard')}
            onLogout={handleLogout}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
}