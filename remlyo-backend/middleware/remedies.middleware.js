import User from "../models/user.model";
import PricingPlan from './../models/pricing_plan.model';



const remedyAccessMiddleware = async (req, res, next) => {
    try {
        const subscription = req.subscription;
        const user = req.user;
        const remedyId = req.params.id;
        // const 

        const userData = await User.findById(user.id);
        const plan = await PricingPlan.findById(subscription.plan);

        if (userData.unlockedRemedies.includes(remedyId)) {
            next()
            return
        }else if (subscription.accessRemedies.length > plan.remediesPerAilment){

        }


    } catch (error) {

    }
};


export default remedyAccessMiddleware;