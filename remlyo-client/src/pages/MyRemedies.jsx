import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import useUserPlan from "../hooks/useUserPlan";
import { getMyRemedies } from "../api/userApi";
import SearchBar from './../components/common/SearchBar';
import Button from "../components/common/Button";
import Pagination from './../components/common/Pagination';

const MyRemedies = () => {
  const { user, authToken } = useAuth();
  const { plan, isPremium } = useUserPlan();
  const [remedies, setRemedies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRemedies, setTotalRemedies] = useState(0);
  const [search, setSearch] = useState("");
  const fetchRemedies = async () => {
    const res = await getMyRemedies(authToken, currentPage, 10, search);
    if (res.success) {
      setRemedies(res.remedies);
      setTotalPages(res.pagination.pages);
      setTotalRemedies(res.pagination.total);
    }
  };

  useEffect(() => {
    fetchRemedies();
  }, [search, currentPage]);

  const getRemedyTypeRoute = (remedy) => {
    // Map remedy types to routes
    const typeRoutes = {
      community: `/remedies/community/${remedy._id}`,
      alternative: `/remedies/alternative/${remedy._id}`,
      pharmaceutical: `/remedies/pharmaceutical/${remedy._id}`,
      ai: `/remedies/ai/${remedy._id}`,
    };

    return typeRoutes[remedy.type] || `/remedies/${remedy._id}`;
  };

  return (
    <DashboardLayout
      pageTitle="My Remedies"
      user={user}
      isPremiumUser={isPremium}
    >
      <div>
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            My Remedies ({totalRemedies})
          </h2>
        </div>
        <div className="!py-4 w-1/2">
          <SearchBar  onSearch={(s) => setSearch(s)} placeholder={"Search your remedies..."}/>
        </div>
        {remedies.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {remedies.map((remedy) => (
              <div
                key={remedy._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={
                    remedy?.media
                      ? remedy.media.source
                      : "https://placehold.co/600x400?text=Remlyo"
                  }
                  alt={remedy.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Remlyo";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{remedy.title}</h3>
                  <div className="flex items-center mt-2 mb-3">
                    <span className="text-gray-700 mr-1">Rating :</span>
                    <span className="font-medium">
                      {remedy.averageRating}/5
                    </span>
                  </div>
                  <Button variant="readMore" to={getRemedyTypeRoute(remedy)}>
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center w-full text-gray-700 !py-5 ">
            No remedies yet
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyRemedies;
