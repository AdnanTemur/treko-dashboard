import { useEffect, useState } from "react";
import { Caption, Font, Heading } from "../../../theme/type";
import { Paper } from "@mui/material";
import { primary } from "../../../theme/color";
import BaseUrl from "../../../utils/config/baseurl";
import Loader from "../../components/atom/Loader";
import AOS from "aos";
import "aos/dist/aos.css";

const DashboardContent = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      delay: 200, // Delay before the animation starts
      duration: 500, // Duration of the animation in milliseconds (2 seconds)
      easing: "ease-in-out", // Easing function for smooth transitions
    });

    const fetchEmployees = async () => {
      try {
        const response = await BaseUrl.get("/api/v1/get-all-employees");
        const employees = response.data.employees;
        setEmployeeCount(employees.length);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <Loader />;

  return (
    <Paper
      data-aos="fade-down"
      elevation={1}
      sx={{
        p: 3,
        mt: 2,
        border: `1px solid ${primary}`,
        width: 150,
        position: "relative",
      }}
    >
      <Font sx={{ color: "black", fontWeight: 600 }}>Total Employees</Font>
      <Heading sx={{ mt: 1, mb: 0.5 }}>{employeeCount}</Heading>
      <Caption sx={{ color: primary }}>Employees</Caption>
    </Paper>
  );
};

export default DashboardContent;
