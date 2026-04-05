import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useInfiniteScroll = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { openAuthModal } = useAuth();
  const observer = useRef();
  const fetchingRef = useRef(false);

  const resetScroll = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError("");
  }, []);

  const executeFetch = useCallback(
    async (currentPage) => {
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      setLoading(true);
      setError("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated artificial delay to show loader
        const responseData = await fetchFunction(currentPage);
        
        if (currentPage === 1) {
          setData(responseData || []);
        } else {
          setData((prev) => [...prev, ...(responseData || [])]);
        }
        
        setHasMore(responseData && responseData.length === 10);
        setPage(currentPage);
      } catch (err) {
        console.error("Infinite scroll error:", err);
        
        if (err.response?.status === 401 && err.response?.data?.action === "REQUIRE_LOGIN") {
          setHasMore(false); // Stop trying to fetch
          openAuthModal(); // Trigger Auth context modal
        } else {
          setError(err.message || "Failed to load more items");
        }
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    },
    // We intentionally ignore fetchFunction as it often causes loops if not memoized perfectly by the consumer.
    // Instead we rely on the specific dependencies passed in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openAuthModal, ...dependencies] 
  );

  useEffect(() => {
    resetScroll();
    executeFetch(1);
  }, [executeFetch, resetScroll]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !error) {
          executeFetch(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, executeFetch, page, error]
  );

  return { data, loading, error, hasMore, lastElementRef };
};
