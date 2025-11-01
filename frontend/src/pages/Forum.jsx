import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function Forum() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
    loadPosts();
  }, [navigate]);

  const loadPosts = async () => {
    try {
      const data = await api.getForumPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await api.createForumPost({
        content: newPost,
        author_id: user.id
      });
      setToast({ message: 'Post created successfully!', type: 'success' });
      setNewPost('');
      loadPosts();
    } catch (error) {
      setToast({ message: 'Failed to create post', type: 'error' });
    }
  };

  if (loading) {
    return <Loader text="Loading forum..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Community Forum 💬</h1>
          <p className="text-purple-100 text-lg">
            Connect, share experiences, and support each other
          </p>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Thoughts</h2>
          <form onSubmit={handleSubmitPost}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind? Share your experience, ask questions, or offer support..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-semibold"
            >
              Post to Forum
            </button>
          </form>
        </div>

        {/* Forum Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <p className="text-gray-600">No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">User #{post.author_id}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    <div className="flex gap-4 mt-4">
                      <button className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
                        👍 Like
                      </button>
                      <button className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">
                        💬 Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;
