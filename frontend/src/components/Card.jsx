import { useState } from 'react';

function Card({ item, type, onSummarize }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const text = type === 'trial' 
        ? `${item.title}. ${item.description || ''} Phase: ${item.phase}. Location: ${item.location}`
        : `${item.title}. ${item.summary}`;
      
      const result = await onSummarize(text);
      setSummary(result);
    } catch (error) {
      console.error('Error summarizing:', error);
      setSummary('Failed to generate summary');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
        {type === 'trial' && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {item.phase}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {item.location}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {item.condition}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {type === 'trial' ? item.description : item.summary}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-medium disabled:opacity-50"
        >
          {loading ? '✨ Summarizing...' : '✨ Summarize'}
        </button>
        <button className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
          ❤️ Save
        </button>
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default Card;
