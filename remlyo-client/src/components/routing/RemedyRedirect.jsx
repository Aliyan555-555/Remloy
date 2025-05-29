// src/components/routing/RemedyRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const RemedyRedirect = () => {
  const { remedyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [remedyType, setRemedyType] = useState(null);

  useEffect(() => {
    // Here you would normally fetch the remedy data to determine its type
    // For now, we'll simulate this with a timeout
    
    setTimeout(() => {
      // Get remedy type based on ID - in a real app this would come from API
      // For demo, we'll use the first character of the ID to determine type:
      // c - community, a - alternative, p - pharmaceutical, i - ai
      const firstChar = remedyId.charAt(0).toLowerCase();
      
      let type = 'community'; // default type
      
      if (firstChar === 'a') {
        type = 'alternative';
      } else if (firstChar === 'p') {
        type = 'pharmaceutical';
      } else if (firstChar === 'i') {
        type = 'ai';
      }
      
      setRemedyType(type);
      setLoading(false);
    }, 300);
  }, [remedyId]);

  if (loading) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  // Redirect to the appropriate remedy type page
  return <Navigate to={`/remedies/${remedyType}/${remedyId}`} replace />;
};

export default RemedyRedirect;