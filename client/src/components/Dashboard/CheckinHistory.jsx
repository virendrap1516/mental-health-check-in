import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { checkinAPI } from '../../services/api';
import Card from '../UI/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CheckinHistory = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const response = await checkinAPI.getAll();
      setCheckins(response.data.checkins);
    } catch (error) {
      console.error('Failed to fetch check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStressColor = (level) => {
    const colors = {
      'Low': 'text-green-600 bg-green-50',
      'Medium': 'text-yellow-600 bg-yellow-50',
      'High': 'text-red-600 bg-red-50'
    };
    return colors[level] || '';
  };

  const getMoodColor = (rating) => {
    if (rating >= 7) return 'text-green-600';
    if (rating >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const chartData = checkins.slice(0, 7).reverse().map(checkin => ({
    date: format(new Date(checkin.date), 'MMM dd'),
    mood: checkin.moodRating,
    stress: checkin.stressLevel === 'Low' ? 3 : checkin.stressLevel === 'Medium' ? 6 : 9
  }));

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mood Chart */}
      {checkins.length > 0 && (
        <Card className="animate-slide-up">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mood Trends (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Check-in List */}
      <Card className="animate-slide-up">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Check-ins</h3>
        
        {checkins.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No check-ins yet. Start tracking your mood today!</p>
        ) : (
          <div className="space-y-3">
            {checkins.map((checkin) => (
              <div
                key={checkin.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                onClick={() => setSelectedCheckin(checkin)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(checkin.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-2xl font-bold ${getMoodColor(checkin.moodRating)}`}>
                        {checkin.moodRating}/10
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStressColor(checkin.stressLevel)}`}>
                        {checkin.stressLevel} Stress
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedCheckin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Check-in Details
              </h3>
              <button
                onClick={() => setSelectedCheckin(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(selectedCheckin.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Mood Rating</p>
                <p className={`text-2xl font-bold ${getMoodColor(selectedCheckin.moodRating)}`}>
                  {selectedCheckin.moodRating}/10
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Stress Level</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStressColor(selectedCheckin.stressLevel)}`}>
                  {selectedCheckin.stressLevel}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Journal Entry</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCheckin.journalEntry}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CheckinHistory;