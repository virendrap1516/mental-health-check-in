import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { checkinAPI } from '../../services/api';
import CheckinForm from './CheckinForm';
import CheckinHistory from './CheckinHistory';
import Card from '../UI/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const response = await checkinAPI.getAll({ limit: 1 });
      const latestCheckin = response.data.checkins[0];
      
      if (latestCheckin) {
        const checkinDate = new Date(latestCheckin.date);
        const today = new Date();
        
        if (
          checkinDate.getDate() === today.getDate() &&
          checkinDate.getMonth() === today.getMonth() &&
          checkinDate.getFullYear() === today.getFullYear()
        ) {
          setHasCheckedInToday(true);
        }
      }
    } catch (error) {
      console.error('Failed to check today status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinSuccess = () => {
    setHasCheckedInToday(true);
    setRefreshHistory(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Track your mental wellness journey, one day at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Check-in Form or Status */}
          <div className="lg:col-span-1">
            {hasCheckedInToday ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  You've checked in today!
                </h3>
                <p className="text-gray-600">
                  Great job taking care of your mental health. See you tomorrow!
                </p>
              </Card>
            ) : (
              <CheckinForm onSuccess={handleCheckinSuccess} />
            )}

            {/* Stats Card */}
            <Card className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Check-ins</span>
                  <span className="font-semibold">Coming soon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold">Coming soon</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Check-in History */}
          <div className="lg:col-span-2">
            <CheckinHistory key={refreshHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;