import React, { useState, useEffect } from 'react';
import useDebounce from './UseDebounce';

function SearchPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => response.json())
        .then(data => {
          const filteredPosts = data.filter(post =>
            (post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
             post.body.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
          );
          setPosts(filteredPosts);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Ошибка при получении постов:', error);
          setIsLoading(false);
        });
    } else {
      setPosts([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Поиск постов..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-infinity loading-lg text-blue-500"></span>
        </div>
      ) : (
        <ul className="list-none pl-5 space-y-4">
          {posts.map(post => (
            <li key={post.id} className="p-4 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-700">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchPosts;
