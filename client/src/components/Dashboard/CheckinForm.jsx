import React, { useState } from 'react';
import { checkinAPI } from '../../services/api';
import Button from '../UI/Button';
import Card from '../UI/Card';

const CheckinForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    moodRating: 5,
    stressLevel: 'Medium',
    journalEntry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moodEmojis = {
    1: '😢', 2: '😔', 3: '😕', 4: '😐', 5: '😊',
    6: '😄', 7: '😃', 8: '😁', 9: '🤗', 10: '🥳'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await checkinAPI.create(formData);
      onSuccess();
      // Reset form
      setFormData({
        moodRating: 5,
        stressLevel: 'Medium',
        journalEntry: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Check-in</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How are you feeling today?
          </label>
          <div className="text-center">
            <div className="text-5xl mb-3">{moodEmojis[formData.moodRating]}</div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.moodRating}
              onChange={(e) => setFormData({ ...formData, moodRating: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Bad</span>
              <span>Excellent</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-primary-600">
              {formData.moodRating}/10
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What's your stress level?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, stressLevel: level })}
                className={`
                  py-3 px-4 rounded-lg font-medium transition-all duration-200
                  ${formData.stressLevel === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {level === 'Low' && '😌 '}
                {level === 'Medium' && '😐 '}
                {level === 'High' && '😰 '}
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind? (This will be encrypted)
          </label>
          <textarea
            value={formData.journalEntry}
            onChange={(e) => setFormData({ ...formData, journalEntry: e.target.value })}
            className="input-field min-h-[120px] resize-none"
            placeholder="Share your thoughts, feelings, or anything you'd like to remember..."
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Check-in'}
        </Button>
      </form>
    </Card>
  );
};

export default CheckinForm;