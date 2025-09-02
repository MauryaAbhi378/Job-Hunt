import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loupe from "../../assets/loupe.png";
import { useDispatch, useSelector } from "react-redux";
import { clearPage, fetchJobs, setJobByText } from "../../store/slice/jobSlice";

function JobSearch() {
  const {
    jobByText,
    filters,
    page = 1,
    limit = 3,
  } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const searchHandler = () => {
    if (page > 1) {
      dispatch(clearPage());
      dispatch(fetchJobs({ page, limit, jobByText, filters }));
    } else {
      dispatch(fetchJobs({ page, limit, jobByText, filters }));
    }
  };

  return (
    <div className="flex w-full max-w-4xl items-center gap-2 rounded-full border bg-white px-3 py-2 shadow-sm">
      <Input
        type="text"
        value={jobByText.keyword}
        onChange={(e) =>
          dispatch(setJobByText({ field: "keyword", value: e.target.value }))
        }
        placeholder="Enter designation/role"
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Input
        type="text"
        value={jobByText.location}
        onChange={(e) =>
          dispatch(setJobByText({ field: "location", value: e.target.value }))
        }
        placeholder="Enter Location"
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Button onClick={searchHandler} className="rounded-full px-6 bg-blue-500">
        <img src={loupe} alt="Search Icon" className="w-5 h-5" />
        Search
      </Button>
    </div>
  );
}

export default JobSearch;
