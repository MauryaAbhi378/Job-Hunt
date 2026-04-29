import { setCompanies } from "../store/slice/companySlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { COMPANIES_API_ENDPOINT } from "../utils/constant";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANIES_API_ENDPOINT}/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          // Sort by createdAt ascending so the most recently created company is last
          const sorted = [...(res.data.companies || [])].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          dispatch(setCompanies(sorted));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
