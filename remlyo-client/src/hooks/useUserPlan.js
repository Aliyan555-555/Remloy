import { useAuth } from "../contexts/AuthContext";

const useUserPlan = () => {
  const { user } = useAuth();
  const plan = user?.activeSubscription?.plan || {};
  // Adjust the logic below if your premium plan check is different
  const isPremium = plan.name?.toLowerCase().includes("premium");
  return { user, plan, isPremium };
};

export default useUserPlan;
